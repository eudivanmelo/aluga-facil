import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideUpload,
  LucideCheckCircle2,
  LucideX,
  LucideSearch
} from '@lucide/angular';
import { ToastService } from '../../core/services/toast.service';
import { PropertyService } from '../../core/services/property.service';
import { GeocodingService } from '../../core/services/geocoding.service';
import { CreatePropertyPayload } from '../../core/models/property.model';
import { LocationPickerComponent } from '../../components/location-picker/location-picker.component';

const PROPERTY_TYPES = ['Apartamento', 'Casa', 'Studio', 'Cobertura', 'Kitnet'];

const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

const AMENITIES_LIST = [
  'Academia', 'Piscina', 'Portaria 24h', 'Salão de Festas', 'Playground',
  'Pet Friendly', 'Churrasqueira', 'Jardim', 'Mobiliado', 'Wi-Fi',
  'Elevador', 'Garagem Coberta', 'Lavanderia', 'Sauna', 'Depósito',
  'Ar-Condicionado', 'Interfone', 'Vaga Coberta'
];

const STEP_LABELS = ['Informações básicas', 'Detalhes e comodidades', 'Fotos'];
const STEP_SHORT_LABELS = ['Básico', 'Detalhes', 'Fotos'];

type CounterField = 'bedrooms' | 'bathrooms' | 'parking';

@Component({
  selector: 'app-anunciar-imovel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideArrowLeft,
    LucideCheck,
    LucideUpload,
    LucideCheckCircle2,
    LucideX,
    LucideSearch,
    LocationPickerComponent
  ],
  templateUrl: './anunciar-imovel.component.html',
})
export class AnunciarImovelComponent {
  @ViewChild(LocationPickerComponent) private readonly locationPicker?: LocationPickerComponent;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly propertyService = inject(PropertyService);
  private readonly geocoding = inject(GeocodingService);

  readonly propertyTypes = PROPERTY_TYPES;
  readonly states = STATES;
  readonly amenitiesList = AMENITIES_LIST;
  readonly stepLabels = STEP_LABELS;
  readonly stepShortLabels = STEP_SHORT_LABELS;
  readonly steps = [1, 2, 3];

  readonly step = signal(1);
  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly createdPropertyId = signal<number | null>(null);

  readonly photos = signal<string[]>([]);
  readonly uploadingPhotos = signal(false);

  readonly pickedLat = signal<number | null>(null);
  readonly pickedLng = signal<number | null>(null);
  readonly locatingAddress = signal(false);

  readonly form: FormGroup = this.fb.group({
    type: ['Apartamento', Validators.required],
    title: ['', Validators.required],
    cep: [''],
    address: ['', Validators.required],
    number: [''],
    complement: [''],
    neighborhood: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    bedrooms: [2],
    bathrooms: [1],
    parking: [1],
    price: ['', Validators.required],
    amenities: [[] as string[]],
    description: ['']
  });

  canGoNext(): boolean {
    const v = this.form.value;
    if (this.step() === 1) {
      return Boolean(v.title && v.address && v.city && v.state) &&
        this.pickedLat() !== null && this.pickedLng() !== null;
    }
    if (this.step() === 2) return Boolean(v.price);
    return this.photos().length > 0 && !this.uploadingPhotos();
  }

  async locateOnMap(): Promise<void> {
    const v = this.form.value;
    if (!v.address || !v.city || !v.state) {
      this.toast.info('Preencha endereço, cidade e estado para localizar no mapa.');
      return;
    }

    this.locatingAddress.set(true);
    try {
      const query = [v.address, v.number, v.neighborhood, v.city, v.state, v.cep, 'Brasil']
        .filter(Boolean)
        .join(', ');

      const geo = await this.geocoding.geocodeAddress(query);
      if (!geo) {
        this.toast.error('Não conseguimos sugerir um ponto para esse endereço. Marque o local manualmente no mapa.');
        return;
      }

      this.locationPicker?.centerOn(geo.latitude, geo.longitude);
      this.toast.info('Local sugerido no mapa — arraste o pin para ajustar a posição exata, se precisar.');
    } finally {
      this.locatingAddress.set(false);
    }
  }

  adjustCounter(field: CounterField, delta: number): void {
    const current = this.form.value[field] ?? 0;
    this.form.patchValue({ [field]: Math.max(0, current + delta) });
  }

  isAmenitySelected(amenity: string): boolean {
    const amenities: string[] = this.form.value.amenities ?? [];
    return amenities.includes(amenity);
  }

  toggleAmenity(amenity: string): void {
    const amenities: string[] = this.form.value.amenities ?? [];
    const updated = amenities.includes(amenity)
      ? amenities.filter((a) => a !== amenity)
      : [...amenities, amenity];
    this.form.patchValue({ amenities: updated });
  }

  formatPrice(value: number | string): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(Number(value));
  }

  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    this.uploadingPhotos.set(true);
    for (const file of Array.from(files)) {
      const res = await this.propertyService.uploadPhoto(file);
      if (res.ok) {
        this.photos.update((list) => [...list, res.url]);
      } else {
        this.toast.error(res.message);
      }
    }
    this.uploadingPhotos.set(false);
    input.value = '';
  }

  removePhoto(url: string): void {
    this.photos.update((list) => list.filter((p) => p !== url));
  }

  goBack(): void {
    if (this.step() > 1) {
      this.step.update((s) => s - 1);
    } else {
      this.router.navigate(['/']);
    }
  }

  async goNext(): Promise<void> {
    if (!this.canGoNext()) return;

    if (this.step() < 3) {
      this.step.update((s) => s + 1);
      return;
    }

    await this.publish();
  }

  private async publish(): Promise<void> {
    const latitude = this.pickedLat();
    const longitude = this.pickedLng();
    if (latitude === null || longitude === null) {
      this.toast.error('Marque o local exato do imóvel no mapa antes de publicar.');
      this.step.set(1);
      return;
    }

    this.isSubmitting.set(true);
    try {
      const v = this.form.value;
      const amenities: string[] = v.amenities ?? [];
      const payload: CreatePropertyPayload = {
        title: v.title,
        description: v.description ?? '',
        price: Number(v.price),
        paymentFrequency: 'Mensal',
        street: v.address,
        number: v.number ?? '',
        neighborhood: v.neighborhood ?? '',
        complement: v.complement ?? '',
        city: v.city,
        state: v.state,
        latitude,
        longitude,
        bedrooms: v.bedrooms,
        bathrooms: v.bathrooms,
        parkingSpaces: v.parking,
        petsAllowed: amenities.includes('Pet Friendly'),
        isFurnished: amenities.includes('Mobiliado'),
        tags: [v.type, ...amenities],
        photoUrls: this.photos()
      };

      const res = await this.propertyService.create(payload);
      if (res.ok) {
        this.createdPropertyId.set(res.property.id);
        this.submitted.set(true);
        this.toast.success('Imóvel cadastrado com sucesso!');
      } else {
        this.toast.error(res.message);
      }
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
