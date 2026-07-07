import { Component, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSlidersHorizontal, LucideChevronDown } from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';
import { PropertyType } from '../../core/models/property.model';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, LucideSlidersHorizontal, LucideChevronDown],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent {
  readonly propertyService = inject(PropertyService);

  readonly types = input<(PropertyType | 'Todos')[]>([
    'Todos',
    'Apartamento',
    'Casa',
    'Studio',
    'Cobertura',
    'Kitnet',
  ]);

  readonly priceOptions = input<number[]>([
    1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000
  ]);

  readonly bedroomOptions = input<number[]>([1, 2, 3, 4]);

  readonly showExtraFilters = signal(false);

  toggleExtraFilters(): void {
    this.showExtraFilters.update((v) => !v);
  }

  selectType(type: PropertyType | 'Todos'): void {
    this.propertyService.setFilters({ type });
  }

  changeMaxPrice(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const parsed = value ? Number(value) : null;
    this.propertyService.setFilters({ maxPrice: parsed });
  }

  changeBedrooms(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    const parsed = value ? Number(value) : null;
    this.propertyService.setFilters({ bedrooms: parsed });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  }

  hasActiveExtraFilters(): boolean {
    const filters = this.propertyService.filters();
    return filters.maxPrice !== null || filters.bedrooms !== null;
  }
}
