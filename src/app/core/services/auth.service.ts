import { Injectable, computed, signal } from '@angular/core';
import { AppUser, StoredCredential, UserRole } from '../models/user.model';

const STORAGE_USERS_KEY = 'aluga-facil:users';
const STORAGE_SESSION_KEY = 'aluga-facil:session';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AppUser | null>(this.restoreSession());
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isAnunciante = computed(() => this._currentUser()?.role === 'anunciante');

  private restoreSession(): AppUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_SESSION_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }

  private getUsers(): StoredCredential[] {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      return raw ? (JSON.parse(raw) as StoredCredential[]) : [];
    } catch {
      return [];
    }
  }

  private saveUsers(users: StoredCredential[]): void {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  private persistSession(user: AppUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }

  async register(payload: RegisterPayload): Promise<{ ok: true } | { ok: false; message: string }> {
    this._loading.set(true);
    await simulateLatency();

    const users = this.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) {
      this._loading.set(false);
      return { ok: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newUser: AppUser = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      role: payload.role,
      createdAt: Date.now(),
    };

    users.push({ email: payload.email, password: payload.password, user: newUser });
    this.saveUsers(users);
    this._currentUser.set(newUser);
    this.persistSession(newUser);
    this._loading.set(false);
    return { ok: true };
  }

  async login(payload: LoginPayload): Promise<{ ok: true } | { ok: false; message: string }> {
    this._loading.set(true);
    await simulateLatency();

    const users = this.getUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password
    );

    this._loading.set(false);
    if (!match) {
      return { ok: false, message: 'E-mail ou senha incorretos. Verifique seus dados e tente novamente.' };
    }

    this._currentUser.set(match.user);
    this.persistSession(match.user);
    return { ok: true };
  }

  async requestPasswordReset(email: string): Promise<{ ok: true } | { ok: false; message: string }> {
    this._loading.set(true);
    await simulateLatency();
    const users = this.getUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    this._loading.set(false);
    if (!exists) {
      return { ok: false, message: 'Não encontramos nenhuma conta com este e-mail.' };
    }
    return { ok: true };
  }

  updateProfile(partial: Partial<Pick<AppUser, 'name' | 'phone' | 'avatarUrl'>>): void {
    const current = this._currentUser();
    if (!current) return;
    const updated: AppUser = { ...current, ...partial };
    this._currentUser.set(updated);
    this.persistSession(updated);

    const users = this.getUsers();
    const idx = users.findIndex((u) => u.user.id === current.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], user: updated };
      this.saveUsers(users);
    }
  }

  logout(): void {
    this._currentUser.set(null);
    this.persistSession(null);
  }
}

function simulateLatency(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}