import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  afterNextRender,
  effect,
  inject,
  input,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import maplibregl from 'maplibre-gl';
import { PropertyMapPoint } from '../../core/models/property.model';

const HOME_ICON_PATH = 'M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
})
export class MapComponent implements OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private readonly router = inject(Router);

  readonly properties = input<PropertyMapPoint[]>([]);

  private map?: maplibregl.Map;
  private markers: maplibregl.Marker[] = [];
  private readonly mapReady = signal(false);

  constructor() {
    // maplibre precisa do DOM real; afterNextRender garante que só rode no browser (evita quebrar o SSR).
    afterNextRender(() => {
      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        // OpenFreeMap: estilo com ruas/OSM completo, gratuito e sem necessidade de API key.
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [-51.9253, -14.235],
        zoom: 3.5,
      });
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

      const geolocate = new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showAccuracyCircle: true,
      });
      this.map.addControl(geolocate, 'top-right');

      // Dispara a localização automaticamente ao carregar; se o usuário negar a permissão,
      // o mapa simplesmente permanece na visão padrão (Brasil).
      this.map.on('load', () => {
        geolocate.trigger();
        this.mapReady.set(true);
      });
    });

    effect(() => {
      const points = this.properties();
      if (!this.mapReady() || !this.map) return;
      this.renderMarkers(points);
    });
  }

  private renderMarkers(points: PropertyMapPoint[]): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    if (!this.map) return;

    for (const point of points) {
      const el = document.createElement('button');
      el.type = 'button';
      el.setAttribute('aria-label', point.title);
      // Sem "transition" no transform: o maplibre reposiciona o marcador via transform a cada
      // frame de pan/zoom, e qualquer transição nessa propriedade faz o pin "arrastar" atrás do mapa.
      el.className =
        'flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-md hover:scale-110 cursor-pointer';
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="${HOME_ICON_PATH}"/></svg>`;

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        closeOnClick: false,
        maxWidth: '220px',
        className: 'property-popup',
      })
        .setLngLat([point.longitude, point.latitude])
        .setDOMContent(this.buildPopupContent(point));

      el.addEventListener('mouseenter', () => popup.addTo(this.map!));
      el.addEventListener('mouseleave', () => popup.remove());
      el.addEventListener('click', () => this.router.navigate(['/imovel', point.id]));

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([point.longitude, point.latitude])
        .addTo(this.map);

      this.markers.push(marker);
    }
  }

  private buildPopupContent(point: PropertyMapPoint): HTMLDivElement {
    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(point.price);

    const photoHtml = point.firstPhotoUrl
      ? `<img src="${point.firstPhotoUrl}" alt="" class="h-24 w-full object-cover" />`
      : `<div class="flex h-24 w-full items-center justify-center bg-gray-100 text-gray-300">
           <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
             <path d="${HOME_ICON_PATH}"/>
           </svg>
         </div>`;

    const node = document.createElement('div');
    node.className = 'w-52 overflow-hidden rounded-xl';
    node.innerHTML = `
      ${photoHtml}
      <div class="p-3">
        <p class="mb-1 line-clamp-2 text-sm font-bold text-gray-900">${point.title}</p>
        <p class="text-sm font-extrabold text-brand-600">${price}<span class="text-xs font-normal text-gray-500">/mês</span></p>
      </div>
    `;
    return node;
  }

  ngOnDestroy(): void {
    this.markers.forEach((marker) => marker.remove());
    this.map?.remove();
  }
}
