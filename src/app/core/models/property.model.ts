export interface Property {
  id: number;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  images: string[];
  videoUrl?: string;
  description: string;
  amenities: string[];
  owner: string;
  phone: string;
  whatsapp: string;
  ownerId?: string;
  createdAt: number;
}

export type PropertyType = 'Apartamento' | 'Casa' | 'Studio' | 'Cobertura' | 'Kitnet' | 'Sobrado';

export const PROPERTY_TYPES: PropertyType[] = [
  'Apartamento',
  'Casa',
  'Studio',
  'Cobertura',
  'Kitnet',
  'Sobrado',
];

export const AMENITY_OPTIONS: string[] = [
  'Academia',
  'Piscina',
  'Portaria 24h',
  'Salão de Festas',
  'Playground',
  'Pet Friendly',
  'Churrasqueira',
  'Garagem Coberta',
  'Lavanderia',
  'Mobiliado',
  'Wi-Fi',
  'Elevador',
  'Sauna',
  'Jardim',
];

export interface PropertyFilters {
  search: string;
  type: PropertyType | 'Todos';
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
}