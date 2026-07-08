import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUser } from '../models/user.model';
import { extractErrorMessage } from '../utils/http-error.util';

const STORAGE_TOKEN_KEY = 'aluga-facil:token';
const STORAGE_USER_KEY = 'aluga-facil:user';

export interface RegisterPayload {
  cpf: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginPayload {
  cpf: string;
  password: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
}

interface AuthResponse {
  token: string;
  user: AppUser;
}

type AuthResult = { ok: true } | { ok: false; message: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _currentUser = signal<AppUser | null>(this.restoreUser());
  private readonly _token = signal<string | null>(
    this.isBrowser ? localStorage.getItem(STORAGE_TOKEN_KEY) : null
  );
  private readonly _loading = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  private restoreUser(): AppUser | null {
    if (!this.isBrowser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }

  private setSession(response: AuthResponse): void {
    this._currentUser.set(response.user);
    this._token.set(response.token);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(response.user));
      localStorage.setItem(STORAGE_TOKEN_KEY, response.token);
    }
  }

  async register(payload: RegisterPayload): Promise<AuthResult> {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      );
      this.setSession(response);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, 'Não foi possível criar sua conta.') };
    } finally {
      this._loading.set(false);
    }
  }

  async login(payload: LoginPayload): Promise<AuthResult> {
    this._loading.set(true);
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      );
      this.setSession(response);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, 'CPF ou senha incorretos.') };
    } finally {
      this._loading.set(false);
    }
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthResult> {
    this._loading.set(true);
    try {
      const updated = await firstValueFrom(
        this.http.put<AppUser>(`${environment.apiUrl}/users/me`, payload)
      );
      this._currentUser.set(updated);
      if (this.isBrowser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: extractErrorMessage(error, 'Não foi possível atualizar seu perfil.') };
    } finally {
      this._loading.set(false);
    }
  }

  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  }
}
