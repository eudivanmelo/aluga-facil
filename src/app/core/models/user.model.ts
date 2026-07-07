export type UserRole = 'inquilino' | 'anunciante';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: number;
}

export interface StoredCredential {
  email: string;
  password: string;
  user: AppUser;
}