import { Component, OnInit, inject, signal } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';
import { PropertyService } from '../../core/services/property.service';
import { PropertyMapPoint } from '../../core/models/property.model';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './mapa.component.html',
})
export class MapaComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  readonly mapProperties = signal<PropertyMapPoint[]>([]);

  ngOnInit(): void {
    this.propertyService.getMapProperties().then((points) => this.mapProperties.set(points));
  }
}
