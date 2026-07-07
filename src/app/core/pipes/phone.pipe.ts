import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';
    
    let raw = value.toString().replace(/\D/g, '');
    
    if (raw.length === 0) {
      return '';
    }
    
    if (raw.length > 11) {
      raw = raw.substring(0, 11);
    }
    
    if (raw.length <= 2) {
      return `(${raw}`;
    } else if (raw.length <= 6) {
      return `(${raw.substring(0, 2)}) ${raw.substring(2)}`;
    } else if (raw.length <= 10) {
      // Formato (XX) XXXX-XXXX (fixo)
      return `(${raw.substring(0, 2)}) ${raw.substring(2, 6)}-${raw.substring(6)}`;
    } else {
      // Formato (XX) XXXXX-XXXX (celular)
      return `(${raw.substring(0, 2)}) ${raw.substring(2, 7)}-${raw.substring(7)}`;
    }
  }
}
