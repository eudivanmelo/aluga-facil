import { Component, effect, inject, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  LucideArrowLeft,
  LucideMapPin,
  LucideBed,
  LucideBath,
  LucideCar,
  LucidePhone,
  LucideChevronLeft,
  LucideChevronRight,
  LucideCheck,
  LucideDumbbell,
  LucideWaves,
  LucideShield
} from '@lucide/angular';
import { PropertyService } from '../../core/services/property.service';
import { PropertyDetail } from '../../core/models/property.model';

@Component({
  selector: 'app-imovel',
  standalone: true,
  imports: [
    RouterModule,
    LucideArrowLeft,
    LucideMapPin,
    LucideBed,
    LucideBath,
    LucideCar,
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

  readonly id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? ''))
  );

  readonly property = signal<PropertyDetail | null>(null);
  readonly loading = signal(true);
  readonly activeImageIndex = signal<number>(0);

  constructor() {
    effect(() => {
      const propertyId = Number(this.id());
      this.loading.set(true);
      this.activeImageIndex.set(0);
      this.propertyService.getById(propertyId).then((result) => {
        this.property.set(result);
        this.loading.set(false);
      });
    });
  }

  formattedPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(price);
  }

  ownerInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }

  getTagIcon(tag: string): string {
    const lower = tag.toLowerCase();
    if (lower.includes('academia')) return 'dumbbell';
    if (lower.includes('piscina')) return 'waves';
    if (lower.includes('portaria') || lower.includes('segurança')) return 'shield';
    return 'check';
  }

  prevImage(): void {
    const prop = this.property();
    if (!prop || prop.photoUrls.length <= 1) return;
    const current = this.activeImageIndex();
    const count = prop.photoUrls.length;
    this.activeImageIndex.set((current - 1 + count) % count);
  }

  nextImage(): void {
    const prop = this.property();
    if (!prop || prop.photoUrls.length <= 1) return;
    const current = this.activeImageIndex();
    const count = prop.photoUrls.length;
    this.activeImageIndex.set((current + 1) % count);
  }

  setImageIndex(index: number): void {
    this.activeImageIndex.set(index);
  }

  handleWhatsApp(): void {
    const prop = this.property();
    if (!prop) return;
    window.open(prop.whatsAppLink, '_blank');
  }

  handleCall(): void {
    const prop = this.property();
    if (!prop) return;
    const digits = prop.owner.phone.replace(/\D/g, '');
    window.open(`tel:+55${digits}`);
  }
}
