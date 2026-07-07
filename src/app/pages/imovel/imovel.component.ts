import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { 
  LucideArrowLeft, 
  LucideMapPin, 
  LucideBed, 
  LucideBath, 
  LucideCar, 
  LucideMaximize, 
  LucideHeart, 
  LucidePhone, 
  LucideChevronLeft, 
  LucideChevronRight, 
  LucideCheck,
  LucideDumbbell,
  LucideWaves,
  LucideShield
} from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-imovel',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    LucideArrowLeft, 
    LucideMapPin, 
    LucideBed, 
    LucideBath, 
    LucideCar, 
    LucideMaximize, 
    LucideHeart, 
    LucidePhone, 
    LucideChevronLeft, 
    LucideChevronRight, 
    LucideCheck,
    LucideDumbbell,
    LucideWaves,
    LucideShield
  ],
  templateUrl: './imovel.component.html',
})
export class ImovelComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly propertyService = inject(PropertyService);
  private readonly favoritesService = inject(FavoritesService);
  private readonly toastService = inject(ToastService);

  readonly id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? ''))
  );

  readonly property = computed(() => {
    const propertyId = Number(this.id());
    return this.propertyService.getById(propertyId) ?? null;
  });

  readonly activeImageIndex = signal<number>(0);

  readonly isFavorite = computed(() => {
    const prop = this.property();
    return prop ? this.favoritesService.isFavorite(prop.id) : false;
  });

  readonly formattedPrice = computed(() => {
    const prop = this.property();
    if (!prop) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(prop.price);
  });

  readonly ownerInitials = computed(() => {
    const prop = this.property();
    if (!prop || !prop.owner) return '';
    return prop.owner.charAt(0).toUpperCase();
  });

  readonly badgeClass = computed(() => {
    const prop = this.property();
    if (!prop) return '';
    switch (prop.type) {
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

  getAmenityIcon(amenity: string): string {
    const lower = amenity.toLowerCase();
    if (lower.includes('academia')) return 'dumbbell';
    if (lower.includes('piscina')) return 'waves';
    if (lower.includes('portaria 24h') || lower.includes('segurança')) return 'shield';
    return 'check';
  }

  prevImage(): void {
    const prop = this.property();
    if (!prop || prop.images.length <= 1) return;
    const current = this.activeImageIndex();
    const count = prop.images.length;
    this.activeImageIndex.set((current - 1 + count) % count);
  }

  nextImage(): void {
    const prop = this.property();
    if (!prop || prop.images.length <= 1) return;
    const current = this.activeImageIndex();
    const count = prop.images.length;
    this.activeImageIndex.set((current + 1) % count);
  }

  setImageIndex(index: number): void {
    this.activeImageIndex.set(index);
  }

  toggleFavorite(): void {
    const prop = this.property();
    if (!prop) return;
    this.favoritesService.toggle(prop.id);
    const currentlyFavorite = this.favoritesService.isFavorite(prop.id);
    if (currentlyFavorite) {
      this.toastService.success('Imóvel adicionado aos favoritos!');
    } else {
      this.toastService.info('Imóvel removido dos favoritos.');
    }
  }
}
