import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    const errors: Record<string, boolean> = {};
    if (value.length < 8) errors['minLength'] = true;
    if (!/[A-Z]/.test(value)) errors['upperCase'] = true;
    if (!/[a-z]/.test(value)) errors['lowerCase'] = true;
    if (!/[0-9]/.test(value)) errors['number'] = true;
    if (!/[^A-Za-z0-9]/.test(value)) errors['specialChar'] = true;

    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  };
}

export function passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const formGroup = group as FormGroup;
    const password = formGroup.get(passwordKey)?.value;
    const confirm = formGroup.get(confirmKey)?.value;

    if (!confirm) return null;
    if (password !== confirm) {
      formGroup.get(confirmKey)?.setErrors({ ...formGroup.get(confirmKey)?.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const confirmErrors = formGroup.get(confirmKey)?.errors;
    if (confirmErrors) {
      delete confirmErrors['passwordMismatch'];
      const hasOtherErrors = Object.keys(confirmErrors).length > 0;
      formGroup.get(confirmKey)?.setErrors(hasOtherErrors ? confirmErrors : null);
    }
    return null;
  };
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }

    const checkDigit = (length: number): number => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += Number(cpf[i]) * (length + 1 - i);
      }
      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };

    const valid = checkDigit(9) === Number(cpf[9]) && checkDigit(10) === Number(cpf[10]);
    return valid ? null : { invalidCpf: true };
  };
}

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11 ? null : { invalidPhone: true };
  };
}