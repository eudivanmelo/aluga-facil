import { Injectable, computed, signal } from '@angular/core';
import { Property, PropertyFilters } from '../models/property.model';
import { MOCK_PROPERTIES } from '../data/mock-properties.data';

const STORAGE_KEY = 'aluga-facil:properties';

export const EMPTY_FILTERS: PropertyFilters = {
  search: '',
  type: 'Todos',
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
};

@Injectable({ providedIn: 'root' })
export class PropertyService {
  private readonly _properties = signal<Property[]>(this.restore());
  private readonly _filters = signal<PropertyFilters>({ ...EMPTY_FILTERS });

  readonly properties = this._properties.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly filteredProperties = computed(() => {
    const list = this._properties();
    const f = this._filters();
    const search = f.search.trim().toLowerCase();

    return list
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.title.toLowerCase().includes(search) ||
          p.neighborhood.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search);
        const matchesType = f.type === 'Todos' || p.type === f.type;
        const matchesMin = f.minPrice === null || p.price >= f.minPrice;
        const matchesMax = f.maxPrice === null || p.price <= f.maxPrice;
        const matchesBedrooms = f.bedrooms === null || p.bedrooms >= f.bedrooms;
        return matchesSearch && matchesType && matchesMin && matchesMax && matchesBedrooms;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  });

  readonly total = computed(() => this._properties().length);
  readonly filteredTotal = computed(() => this.filteredProperties().length);

  private restore(): Property[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Property[];
    } catch {
      /* ignora e cai para o mock */
    }
    return [...MOCK_PROPERTIES];
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._properties()));
  }

  setFilters(filters: Partial<PropertyFilters>): void {
    this._filters.update((current) => ({ ...current, ...filters }));
  }

  resetFilters(): void {
    this._filters.set({ ...EMPTY_FILTERS });
  }

  getById(id: number): Property | undefined {
    return this._properties().find((p) => p.id === id);
  }

  getByOwner(ownerId: string): Property[] {
    return this._properties().filter((p) => p.ownerId === ownerId);
  }

  create(data: Omit<Property, 'id' | 'createdAt'>): Property {
    const nextId = this._properties().reduce((max, p) => Math.max(max, p.id), 0) + 1;
    const newProperty: Property = { ...data, id: nextId, createdAt: Date.now() };
    this._properties.update((list) => [newProperty, ...list]);
    this.persist();
    return newProperty;
  }

  update(id: number, data: Partial<Property>): void {
    this._properties.update((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
    this.persist();
  }

  delete(id: number): void {
    this._properties.update((list) => list.filter((p) => p.id !== id));
    this.persist();
  }
}