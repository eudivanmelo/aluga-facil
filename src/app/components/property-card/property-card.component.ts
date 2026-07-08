import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideMapPin,
  LucideBed,
  LucideBath,
  LucideCar,
  LucideHome
} from '@lucide/angular';
import { PropertySummary } from '../../core/models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    LucideMapPin,
    LucideBed,
    LucideBath,
    LucideCar,
    LucideHome
  ],
  templateUrl: './property-card.component.html',
})
export class PropertyCardComponent {
  private readonly router = inject(Router);

  readonly property = input.required<PropertySummary>();

  readonly formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(this.property().price);
  });

  navigateToDetails(): void {
    this.router.navigate(['/imovel', this.property().id]);
  }
}
