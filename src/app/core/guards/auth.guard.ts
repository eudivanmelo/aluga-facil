import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isAuthenticated()) {
    return true;
  }

  toast.info('Você precisa entrar na sua conta para acessar essa página.');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const anuncianteGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (!auth.isAuthenticated()) {
    toast.info('Você precisa entrar na sua conta para acessar essa página.');
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  if (!auth.isAnunciante()) {
    toast.error('Somente contas de anunciante podem gerenciar imóveis.');
    return router.createUrlTree(['/']);
  }

  return true;
};

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? router.createUrlTree(['/']) : true;
};