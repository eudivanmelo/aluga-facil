import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'aluga-facil:favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly _favoriteIds = signal<Set<number>>(this.restore());

  readonly favoriteIds = this._favoriteIds.asReadonly();
  readonly count = computed(() => this._favoriteIds().size);

  private restore(): Set<number> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set<number>(JSON.parse(raw)) : new Set<number>();
    } catch {
      return new Set<number>();
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this._favoriteIds()]));
  }

  isFavorite(id: number): boolean {
    return this._favoriteIds().has(id);
  }

  toggle(id: number): void {
    this._favoriteIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    this.persist();
  }
}