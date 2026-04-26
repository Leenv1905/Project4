import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const shopGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authReady$.pipe(
    map(() => {
      if (!auth.isAuthenticated()) {
        auth.openLogin();
        router.navigate(['/']);
        return false;
      }
      if (auth.hasRole('shop') || auth.hasRole('seller')) return true;
      router.navigate(['/']);
      return false;
    })
  );
};