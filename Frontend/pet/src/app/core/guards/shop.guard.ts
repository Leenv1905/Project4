import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const shopGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    auth.openLogin();
    router.navigate(['/']);
    return false;
  }

  if (auth.hasRole('shop')) {
    return true;
  }

  alert('Chỉ shop mới truy cập được');
  router.navigate(['/']);
  return false;
};
