import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint =
        req.url.includes('/refresh') ||
        req.url.includes('/login') ||
        req.url.includes('/logout');

      if (error.status !== 401 || isAuthEndpoint) {
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshDone$.next(null);

        return authService.refresh().pipe(
          catchError((refreshError) => {
            isRefreshing = false;
            refreshDone$.next(false);
            authService.forceLogout();
            return throwError(() => refreshError);
          }),
          switchMap(() => {
            isRefreshing = false;
            refreshDone$.next(true);
            return next(req);
          })
        );
      }

      // Các request khác chờ refresh xong rồi retry
      return refreshDone$.pipe(
        filter((result) => result !== null),
        take(1),
        switchMap((success) => {
          if (success) {
            return next(req);
          }
          return throwError(() => error);
        })
      );
    })
  );
};