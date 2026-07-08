import { Component, OnInit, inject, signal, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSlidersHorizontal, LucideChevronDown } from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';

const PROPERTY_TYPES = ['Apartamento', 'Casa', 'Studio', 'Cobertura', 'Kitnet'];

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, LucideSlidersHorizontal, LucideChevronDown],
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent implements OnInit {
  readonly propertyService = inject(PropertyService);

  readonly quickTypes = ['Todos', ...PROPERTY_TYPES];

  readonly priceOptions = input<number[]>([
    1000, 1500, 2000, 2500, 3000, 4000, 5000, 7500, 10000
  ]);

  readonly bedroomOptions = input<number[]>([1, 2, 3, 4]);

  readonly cities = signal<string[]>([]);
  readonly showExtraFilters = signal(false);

  ngOnInit(): void {
    this.propertyService.getCities().then((cities) => this.cities.set(cities));
  }

  toggleExtraFilters(): void {
    this.showExtraFilters.update((v) => !v);
  }

  changeCity(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.propertyService.setFilters({ city: value });
  }

  isTypeSelected(type: string): boolean {
    const tag = this.propertyService.filters().tag;
    return type === 'Todos' ? !tag : tag === type;
  }

  selectType(type: string): void {
    this.propertyService.setFilters({ tag: type === 'Todos' ? null : type });
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

  togglePetsAllowed(): void {
    const current = this.propertyService.filters().petsAllowed;
    this.propertyService.setFilters({ petsAllowed: current ? null : true });
  }

  toggleFurnished(): void {
    const current = this.propertyService.filters().isFurnished;
    this.propertyService.setFilters({ isFurnished: current ? null : true });
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
    return (
      Boolean(filters.city) ||
      filters.maxPrice !== null ||
      filters.bedrooms !== null ||
      filters.petsAllowed !== null ||
      filters.isFurnished !== null
    );
  }
}
