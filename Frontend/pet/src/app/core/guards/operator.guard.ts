import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const operatorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    auth.openLogin();
    router.navigate(['/']);
    return false;
  }

  if (auth.hasAnyRole(['operators'])) {
    return true;
  }

  toast.error('Yêu cầu quyền Nhân viên (Operator)');
  router.navigate(['/']);
  return false;
};
