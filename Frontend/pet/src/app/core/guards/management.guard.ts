import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const managementGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);
  const router = inject(Router);

  return auth.authReady$.pipe(
    map(() => {
      if (!auth.isAuthenticated()) {
        auth.openLogin();
        router.navigate(['/']);
        return false;
      }
      if (auth.hasAnyRole(['admin', 'operator'])) return true;
      toast.error('Bạn không có quyền truy cập khu vực quản lý');
      router.navigate(['/']);
      return false;
    })
  );
};
