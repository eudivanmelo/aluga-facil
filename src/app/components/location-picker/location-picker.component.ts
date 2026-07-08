import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender, model } from '@angular/core';
import maplibregl from 'maplibre-gl';

const DEFAULT_CENTER: [number, number] = [-51.9253, -14.235]; // Brasil

@Component({
  selector: 'app-location-picker',
  standalone: true,
  templateUrl: './location-picker.component.html',
})
export class LocationPickerComponent implements OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  // Two-way bindable: [(latitude)] / [(longitude)] no componente pai.
  readonly latitude = model<number | null>(null);
  readonly longitude = model<number | null>(null);

  private map?: maplibregl.Map;
  private marker?: maplibregl.Marker;

  constructor() {
    afterNextRender(() => {
      const hasInitial = this.latitude() !== null && this.longitude() !== null;
      const center: [number, number] = hasInitial
        ? [this.longitude()!, this.latitude()!]
        : DEFAULT_CENTER;

      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center,
        zoom: hasInitial ? 16 : 3.5,
      });
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

      if (hasInitial) {
        this.placeMarker(this.longitude()!, this.latitude()!);
      } else if (navigator.geolocation) {
        // Sem local ainda definido: só centraliza no usuário como ponto de partida — não planta o
        // pin aí, já que a localização do usuário não é a localização do imóvel. A posição final
        // só é definida quando ele clica ou arrasta o pin no mapa.
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (this.latitude() !== null) return; // já marcou um ponto enquanto aguardava a permissão
            this.map?.setCenter([position.coords.longitude, position.coords.latitude]);
            this.map?.setZoom(14);
          },
          () => { /* permissão negada ou indisponível: mantém a visão padrão do Brasil */ },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }

      // Clicar no mapa marca/reposiciona o pin — é essa posição que vira a lat/lng do anúncio,
      // nunca o resultado "cru" de uma geocodificação automática.
      this.map.on('click', (e) => this.setLocation(e.lngLat.lat, e.lngLat.lng));
    });
  }

  /** Move o mapa até um ponto (ex: resultado de uma busca de endereço) e já marca o pin ali, como sugestão inicial. */
  centerOn(lat: number, lng: number, zoom = 16): void {
    this.map?.flyTo({ center: [lng, lat], zoom });
    this.setLocation(lat, lng);
  }

  private setLocation(lat: number, lng: number): void {
    this.latitude.set(lat);
    this.longitude.set(lng);
    this.placeMarker(lng, lat);
  }

  private placeMarker(lng: number, lat: number): void {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLngLat([lng, lat]);
      return;
    }

    this.marker = new maplibregl.Marker({ draggable: true, color: '#0d9488' })
      .setLngLat([lng, lat])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker!.getLngLat();
      this.setLocation(pos.lat, pos.lng);
    });
  }

  ngOnDestroy(): void {
    this.marker?.remove();
    this.map?.remove();
  }
}
