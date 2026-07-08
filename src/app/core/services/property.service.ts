import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreatePropertyPayload,
  PagedResult,
  PropertyDetail,
  PropertyFilters,
  PropertyMapPoint,
  PropertyStats,
  PropertySummary
} from '../models/property.model';
import { extractErrorMessage } from '../utils/http-error.util';

type PropertyResult = { ok: true; property: PropertyDetail } | { ok: false; message: string };
type UploadResult = { ok: true; url: string } | { ok: false; message: string };

export const EMPTY_FILTERS: PropertyFilters = {
  search: '',
  city: '',
  maxPrice: null,
  bedrooms: null,
  petsAllowed: null,
  isFurnished: null,
  tag: null,
};

const PAGE_SIZE = 60;

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly http = inject(HttpClient);

  private readonly _properties = signal<PropertySummary[]>([]);
  private readonly _filters = signal<PropertyFilters>({ ...EMPTY_FILTERS });
  private readonly _total = signal(0);
  private readonly _loading = signal(false);

  readonly properties = this._properties.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly total = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() {
    effect(() => {
      this.fetchCatalog(this._filters());
    });
  }

  private async fetchCatalog(filters: PropertyFilters): Promise<void> {
    this._loading.set(true);
    try {
      let params = new HttpParams().set('pageSize', PAGE_SIZE);
      if (filters.search) params = params.set('search', filters.search);
      if (filters.city) params = params.set('city', filters.city);
      if (filters.maxPrice !== null) params = params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms !== null) params = params.set('bedrooms', filters.bedrooms);
      if (filters.petsAllowed !== null) params = params.set('petsAllowed', filters.petsAllowed);
      if (filters.isFurnished !== null) params = params.set('isFurnished', filters.isFurnished);
      if (filters.tag) params = params.set('tag', filters.tag);

      const result = await firstValueFrom(
        this.http.get<PagedResult<PropertySummary>>(`${environment.apiUrl}/properties`, { params })
      );
      this._properties.set(result.data);
      this._total.set(result.total);
    } catch {
      this._properties.set([]);
      this._total.set(0);
    } finally {
      this._loading.set(false);
    }
  }

  setFilters(filters: Partial<PropertyFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this._filters.set({ ...EMPTY_FILTERS });
  }

  async getById(id: number): Promise<PropertyDetail | null> {
    try {
      return await firstValueFrom(this.http.get<PropertyDetail>(`${environment.apiUrl}/properties/${id}`));
    } catch {
      return null;
    }
  }

  async getMine(): Promise<PropertySummary[]> {
    try {
      return await firstValueFrom(this.http.get<PropertySummary[]>(`${environment.apiUrl}/properties/mine`));
    } catch {
      return [];
    }
  }

  async getMapProperties(): Promise<PropertyMapPoint[]> {
    try {
      return await firstValueFrom(this.http.get<PropertyMapPoint[]>(`${environment.apiUrl}/properties/map`));
    } catch {
      return [];
    }
  }

  async getCities(): Promise<string[]> {
    try {
      return await firstValueFrom(this.http.get<string[]>(`${environment.apiUrl}/properties/cities`));
    } catch {
      return [];
    }
  }

  async getStats(): Promise<PropertyStats | null> {
    try {
      return await firstValueFrom(this.http.get<PropertyStats>(`${environment.apiUrl}/stats`));
    } catch {
      return null;
    }
  }

  async uploadPhoto(file: File): Promise<UploadResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await firstValueFrom(
        this.http.post<{ url: string }>(`${environment.apiUrl}/photos/upload`, formData)
      );
      return { ok: true, url: res.url };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, 'Não foi possível enviar a imagem.') };
    }
  }

  async create(payload: CreatePropertyPayload): Promise<PropertyResult> {
    try {
      const property = await firstValueFrom(
        this.http.post<PropertyDetail>(`${environment.apiUrl}/properties`, payload)
      );
      return { ok: true, property };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, 'Não foi possível publicar o anúncio.') };
    }
  }
}
