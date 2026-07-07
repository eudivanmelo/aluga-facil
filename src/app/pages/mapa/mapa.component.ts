import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './mapa.component.html',
})
export class MapaComponent {}
