import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, PropertyDetail, PropertyFilters, PropertySummary } from '../models/property.model';

export const EMPTY_FILTERS: PropertyFilters = {
  city: '',
  maxPrice: null,
  bedrooms: null,
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
      if (filters.city) params = params.set('city', filters.city);
      if (filters.maxPrice !== null) params = params.set('maxPrice', filters.maxPrice);
      if (filters.bedrooms !== null) params = params.set('bedrooms', filters.bedrooms);

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
}
