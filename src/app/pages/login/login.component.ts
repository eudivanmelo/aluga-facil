import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { 
  LucideMail, 
  LucideLock, 
  LucideEye, 
  LucideEyeOff 
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideMail,
    LucideLock,
    LucideEye,
    LucideEyeOff
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  async onForgotPassword(): Promise<void> {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.toast.info('Por favor, informe seu e-mail no campo correspondente para recuperar a senha.');
      return;
    }

    try {
      const res = await this.auth.requestPasswordReset(email);
      if (res.ok) {
        this.toast.success('Se o e-mail estiver cadastrado, as instruções de recuperação foram enviadas.');
      } else {
        this.toast.error((res as { ok: false; message: string }).message);
      }
    } catch (error) {
      this.toast.error('Erro ao processar a solicitação de redefinição de senha.');
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { email, password } = this.loginForm.value;

    try {
      const res = await this.auth.login({ email, password });
      if (res.ok) {
        this.toast.success('Bem-vindo de volta! Login realizado com sucesso.');
        this.router.navigate(['/']);
      } else {
        this.toast.error((res as { ok: false; message: string }).message);
      }
    } catch (error) {
      this.toast.error('Ocorreu um erro ao tentar realizar o login.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
