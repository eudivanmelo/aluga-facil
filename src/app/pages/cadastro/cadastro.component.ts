import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideUser,
  LucideMail,
  LucidePhone,
  LucideIdCard,
  LucideLock,
  LucideEye,
  LucideEyeOff
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { CpfPipe } from '../../core/pipes/cpf.pipe';
import { cpfValidator } from '../../core/validators/custom-validators';

@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideUser,
    LucideMail,
    LucidePhone,
    LucideIdCard,
    LucideLock,
    LucideEye,
    LucideEyeOff
  ],
  providers: [PhonePipe, CpfPipe],
  templateUrl: './cadastro.component.html',
})
export class CadastroComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly phonePipe = inject(PhonePipe);
  private readonly cpfPipe = inject(CpfPipe);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);
  readonly isSubmitting = signal(false);

  readonly cadastroForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    cpf: ['', [Validators.required, cpfValidator()]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordMatchValidator
  });

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.cadastroForm.get('phone')?.valueChanges.subscribe((val: string) => {
      if (val) {
        const cleaned = val.replace(/\D/g, '');
        const formatted = this.phonePipe.transform(cleaned);
        this.cadastroForm.get('phone')?.setValue(formatted, { emitEvent: false });
      }
    });

    this.cadastroForm.get('cpf')?.valueChanges.subscribe((val: string) => {
      if (val) {
        const formatted = this.cpfPipe.transform(val.replace(/\D/g, ''));
        this.cadastroForm.get('cpf')?.setValue(formatted, { emitEvent: false });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  private passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    if (confirmPassword && confirmPassword.hasError('mismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['mismatch'];
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
    }
    
    return null;
  }

  async onSubmit(): Promise<void> {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { name, cpf, email, password, phone } = this.cadastroForm.value;

    try {
      const res = await this.auth.register({
        cpf: cpf.replace(/\D/g, ''),
        name,
        email,
        password,
        phone: phone.replace(/\D/g, '')
      });

      if (res.ok) {
        this.toast.success('Sua conta foi criada com sucesso! Seja bem-vindo.');
        this.router.navigate(['/']);
      } else {
        this.toast.error(res.message);
      }
    } catch (error) {
      this.toast.error('Ocorreu um erro ao tentar criar a sua conta.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
