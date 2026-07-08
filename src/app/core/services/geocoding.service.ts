import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

// Nominatim (OpenStreetMap): geocodificação gratuita e sem API key, mesma linha do OpenFreeMap
// já usado no mapa. O browser não deixa customizar o header User-Agent exigido pela política de
// uso deles; para um volume alto de chamadas isso deveria passar por um proxy no backend.
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly http = inject(HttpClient);

  async geocodeAddress(query: string): Promise<GeocodeResult | null> {
    try {
      const results = await firstValueFrom(
        this.http.get<NominatimResult[]>(NOMINATIM_URL, {
          params: { q: query, format: 'json', limit: '1', countrycodes: 'br' }
        })
      );
      if (!results.length) return null;
      return { latitude: Number(results[0].lat), longitude: Number(results[0].lon) };
    } catch {
      return null;
    }
  }
}
