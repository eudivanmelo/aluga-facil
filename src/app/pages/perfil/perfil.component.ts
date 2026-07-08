import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideLogOut,
  LucideUser,
  LucidePhone,
  LucideHome,
  LucidePlus
} from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { PropertyService } from '../../core/services/property.service';
import { ToastService } from '../../core/services/toast.service';
import { PropertyCardComponent } from '../../components/property-card/property-card.component';
import { PropertySummary } from '../../core/models/property.model';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { CpfPipe } from '../../core/pipes/cpf.pipe';
import { phoneValidator } from '../../core/validators/custom-validators';

type ProfileTab = 'imoveis' | 'configuracoes';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    LucideLogOut,
    LucideUser,
    LucidePhone,
    LucideHome,
    LucidePlus,
    PropertyCardComponent,
    CpfPipe
  ],
  providers: [PhonePipe],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly propertyService = inject(PropertyService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly phonePipe = inject(PhonePipe);

  readonly currentUser = this.auth.currentUser;
  readonly tab = signal<ProfileTab>('imoveis');
  readonly isSubmitting = signal(false);

  readonly initials = computed(() => {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  });

  readonly myProperties = signal<PropertySummary[]>([]);
  readonly loadingProperties = signal(true);

  readonly settingsForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, phoneValidator()]]
  });

  ngOnInit(): void {
    const user = this.currentUser();
    this.settingsForm.patchValue({ name: user?.name ?? '', phone: user?.phone ?? '' });

    this.settingsForm.get('phone')?.valueChanges.subscribe((val: string) => {
      if (val) {
        const formatted = this.phonePipe.transform(val.replace(/\D/g, ''));
        this.settingsForm.get('phone')?.setValue(formatted, { emitEvent: false });
      }
    });

    this.propertyService.getMine().then((properties) => {
      this.myProperties.set(properties);
      this.loadingProperties.set(false);
    });
  }

  setTab(tab: ProfileTab): void {
    this.tab.set(tab);
  }

  logout(): void {
    this.auth.logout();
    this.toast.success('Sessão encerrada com sucesso.');
    this.router.navigate(['/']);
  }

  async onSaveSettings(): Promise<void> {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const { name, phone } = this.settingsForm.value;

    try {
      const res = await this.auth.updateProfile({ name, phone: phone.replace(/\D/g, '') });
      if (res.ok) {
        this.toast.success('Perfil atualizado com sucesso!');
      } else {
        this.toast.error(res.message);
      }
    } catch (error) {
      this.toast.error('Ocorreu um erro ao atualizar seu perfil.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
