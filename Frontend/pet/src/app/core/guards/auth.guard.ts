import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.authReady$.pipe(
    map(() => {
      if (auth.isAuthenticated()) return true;
      auth.openLogin();
      router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    })
  );
};