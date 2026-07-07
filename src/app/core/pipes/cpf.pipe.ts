import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true
})
export class CpfPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (!value) return '';

    let raw = value.toString().replace(/\D/g, '');

    if (raw.length === 0) {
      return '';
    }

    if (raw.length > 11) {
      raw = raw.substring(0, 11);
    }

    if (raw.length <= 3) {
      return raw;
    } else if (raw.length <= 6) {
      return `${raw.substring(0, 3)}.${raw.substring(3)}`;
    } else if (raw.length <= 9) {
      return `${raw.substring(0, 3)}.${raw.substring(3, 6)}.${raw.substring(6)}`;
    } else {
      return `${raw.substring(0, 3)}.${raw.substring(3, 6)}.${raw.substring(6, 9)}-${raw.substring(9)}`;
    }
  }
}
