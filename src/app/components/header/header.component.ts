import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideHouse, LucideHeart, LucideUser, LucideMenu, LucideX, LucidePlus, LucideLogOut, LucideFileText } from '@lucide/angular';
import { AuthService } from '../../core/services/auth.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideFileText],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly favorites = inject(FavoritesService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly icons = { LucideHouse, LucideHeart, LucideUser, LucideMenu, LucideX, LucidePlus, LucideLogOut };
  readonly mobileMenuOpen = signal(false);
  readonly userMenuOpen = signal(false);

  readonly currentUser = this.auth.currentUser;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly favoritesCount = this.favorites.count;

  readonly initials = computed(() => {
    const name = this.currentUser()?.name ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('');
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  logout(): void {
    this.auth.logout();
    this.userMenuOpen.set(false);
    this.closeMobileMenu();
    this.toast.success('Sessão encerrada com sucesso.');
    this.router.navigate(['/']);
  }
}