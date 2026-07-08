import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideSearch, LucideX } from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';
import { PropertyStats } from '../../core/models/property.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideSearch, LucideX],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit {
  private readonly propertyService = inject(PropertyService);

  readonly searchTerm = signal('');
  readonly stats = signal<PropertyStats | null>(null);

  ngOnInit(): void {
    this.propertyService.getStats().then((stats) => this.stats.set(stats));
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.propertyService.setFilters({ search: value });
  }

  clearSearch(): void {
    this.onSearchInput('');
  }
}
