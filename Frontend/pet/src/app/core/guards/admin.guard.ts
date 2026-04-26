import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = () => {
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
      if (auth.hasAnyRole(['admin'])) return true;
      toast.error('Yêu cầu quyền Quản trị viên (Admin)');
      router.navigate(['/admin']);
      return false;
    })
  );
};