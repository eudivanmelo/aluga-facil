import { AppUser } from './user.model';

export interface PropertySummary {
  id: number;
  title: string;
  price: number;
  paymentFrequency: string;
  city: string;
  state: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  petsAllowed: boolean;
  isFurnished: boolean;
  tags: string[];
  firstPhotoUrl: string | null;
  latitude: number;
  longitude: number;
}

export interface PropertyDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  paymentFrequency: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  petsAllowed: boolean;
  isFurnished: boolean;
  tags: string[];
  photoUrls: string[];
  owner: AppUser;
  whatsAppLink: string;
}

export interface PropertyMapPoint {
  id: number;
  title: string;
  price: number;
  latitude: number;
  longitude: number;
  firstPhotoUrl: string | null;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  price: number;
  paymentFrequency: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  petsAllowed: boolean;
  isFurnished: boolean;
  tags: string[];
  photoUrls: string[];
}

export interface PropertyFilters {
  /** Busca livre (cidade, bairro ou título) — usada pela busca do Hero. */
  search: string;
  /** Cidade exata escolhida no dropdown de filtros. */
  city: string;
  maxPrice: number | null;
  bedrooms: number | null;
  petsAllowed: boolean | null;
  isFurnished: boolean | null;
  tag: string | null;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PropertyStats {
  activeProperties: number;
  cities: number;
  users: number;
}
