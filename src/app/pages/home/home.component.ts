import { Component, inject } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { FilterBarComponent } from '../../components/filter-bar/filter-bar.component';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FilterBarComponent, PropertyCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly propertyService = inject(PropertyService);
}
