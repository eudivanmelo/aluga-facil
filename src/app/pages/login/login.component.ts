import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideIdCard,
  LucideLock,
  LucideEye,
  LucideEyeOff
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CpfPipe } from '../../core/pipes/cpf.pipe';
import { cpfValidator } from '../../core/validators/custom-validators';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideIdCard,
    LucideLock,
    LucideEye,
    LucideEyeOff
  ],
  providers: [CpfPipe],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly cpfPipe = inject(CpfPipe);

  readonly loginForm: FormGroup = this.fb.group({
    cpf: ['', [Validators.required, cpfValidator()]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.loginForm.get('cpf')?.valueChanges.subscribe((val: string) => {
      if (val) {
        const formatted = this.cpfPipe.transform(val.replace(/\D/g, ''));
        this.loginForm.get('cpf')?.setValue(formatted, { emitEvent: false });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { cpf, password } = this.loginForm.value;

    try {
      const res = await this.auth.login({ cpf: cpf.replace(/\D/g, ''), password });
      if (res.ok) {
        this.toast.success('Bem-vindo de volta! Login realizado com sucesso.');
        this.router.navigate(['/']);
      } else {
        this.toast.error(res.message);
      }
    } catch (error) {
      this.toast.error('Ocorreu um erro ao tentar realizar o login.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
