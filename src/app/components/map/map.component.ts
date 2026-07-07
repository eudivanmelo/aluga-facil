import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender } from '@angular/core';
import maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
})
export class MapComponent implements OnDestroy {
  @ViewChild('mapContainer', { static: true })
  private readonly mapContainer!: ElementRef<HTMLDivElement>;

  private map?: maplibregl.Map;

  constructor() {
    afterNextRender(() => {
      this.map = new maplibregl.Map({
        container: this.mapContainer.nativeElement,
        style: 'https://tiles.versatiles.org/assets/styles/colorful/style.json',
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

      this.map.on('load', () => geolocate.trigger());
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }
}
