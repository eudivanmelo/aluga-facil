import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  LucideHeart, 
  LucideMapPin, 
  LucideBed, 
  LucideBath, 
  LucideCar, 
  LucideMaximize 
} from '@lucide/angular';
import { Property } from '../../core/models/property.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    CommonModule, 
    LucideHeart, 
    LucideMapPin, 
    LucideBed, 
    LucideBath, 
    LucideCar, 
    LucideMaximize
  ],
  templateUrl: './property-card.component.html',
})
export class PropertyCardComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly toastService = inject(ToastService);

  readonly property = input.required<Property>();

  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.property().id));

  readonly formattedPrice = computed(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(this.property().price);
  });

  readonly badgeClass = computed(() => {
    const type = this.property().type;
    switch (type) {
      case 'Apartamento':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10';
      case 'Casa':
        return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/10';
      case 'Studio':
        return 'bg-purple-50 text-purple-700 ring-1 ring-purple-700/10';
      case 'Cobertura':
        return 'bg-amber-50 text-amber-700 ring-1 ring-amber-700/10';
      case 'Kitnet':
        return 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-700/10';
      case 'Sobrado':
        return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/10';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-700/10';
    }
  });

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    const id = this.property().id;
    this.favoritesService.toggle(id);
    const currentlyFavorite = this.favoritesService.isFavorite(id);
    if (currentlyFavorite) {
      this.toastService.success('Imóvel adicionado aos favoritos!');
    } else {
      this.toastService.info('Imóvel removido dos favoritos.');
    }
  }

  navigateToDetails(): void {
    // todo
  }
}
