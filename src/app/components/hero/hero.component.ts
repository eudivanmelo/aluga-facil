import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSearch, LucideX } from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideSearch, LucideX],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly propertyService = inject(PropertyService);

  readonly searchTerm = signal('');

  readonly stats = [
    { value: '1.200+', label: 'Imóveis ativos' },
    { value: '150+', label: 'Cidades' },
    { value: '8.500+', label: 'Usuários' },
  ];

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.propertyService.setFilters({ city: value });
  }

  clearSearch(): void {
    this.onSearchInput('');
  }
}
