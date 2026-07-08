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

export interface PropertyFilters {
  city: string;
  maxPrice: number | null;
  bedrooms: number | null;
}

export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
