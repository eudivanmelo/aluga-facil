import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  isExiting?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  readonly toasts = this._toasts.asReadonly();

  private push(type: ToastType, message: string, durationMs = 4000): void {
    const id = ++this.counter;
    this._toasts.update((list) => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    const toast = this._toasts().find((t) => t.id === id);
    if (!toast || toast.isExiting) return;

    this._toasts.update((list) =>
      list.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    setTimeout(() => {
      this._toasts.update((list) => list.filter((t) => t.id !== id));
    }, 150);
  }
}