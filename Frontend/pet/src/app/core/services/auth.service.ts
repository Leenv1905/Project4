import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

declare var jwt_decode: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user;

  isAuthenticated = computed(() => !!this._user());
  role = computed(() => this.normalizeRole(this._user()?.role || ''));

  canAccessAdmin = computed(() => {
    const currentRole = this.role();
    return currentRole === 'admin' || currentRole === 'operators';
  });

  canAccessHome = computed(() => {
    const currentRole = this.role();
    return ['user', 'shop', 'admin', 'operators'].includes(currentRole);
  });

  private _showLoginModal = signal(false);
  showLoginModal = this._showLoginModal;

  private http = inject(HttpClient);
  router = inject(Router);
  private apiUrl = 'http://localhost:8080/gupet/v1/auth/user';

  constructor() {
    this.initUserFromStorage();

    this.loadCurrentUser().subscribe({
      next: () => {},
      error: () => {}
    });

    effect(() => {
      const currentUser = this._user();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  openLogin() {
    this._showLoginModal.set(true);
  }

  closeLogin() {
    this._showLoginModal.set(false);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap((res) => {
        if (res && res.status === 200 && res.data) {
          const found: User = {
            id: res.data.userId,
            email,
            name: res.data.name,
            role: res.data.role
          };
          this._user.set(found);
          this.closeLogin();
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, payload, { withCredentials: true }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
        this.router.navigate(['/']);
      }),
      catchError((err) => {
        this.clearSession();
        this.router.navigate(['/']);
        return this.handleError(err);
      })
    );
  }

  refresh(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { withCredentials: true });
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map((res) => {
        if (res && res.status === 200 && res.data) {
          const me: User = {
            id: res.data.userId,
            email: res.data.email || '',
            name: res.data.name,
            role: res.data.role
          };
          this._user.set(me);
          return me;
        }
        return null;
      }),
      catchError(() => {
        const fallback = this.getUserFromToken();
        if (fallback) {
          this._user.set(fallback);
          return of(fallback);
        }
        this._user.set(null);
        return of(null);
      })
    );
  }

  navigateAfterLogin(returnUrl?: string | null) {
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    const currentRole = this.role();
    if (currentRole === 'admin' || currentRole === 'operators') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  getUserFromToken(): User | null {
    const accessToken = this.getCookie('access_token');
    if (!accessToken) {
      return null;
    }

    const decoded = this.decodeJwt(accessToken);
    if (!decoded || !decoded.sub) {
      return null;
    }

    const roleClaim = decoded.role || decoded.roles || 'USER';
    return {
      id: decoded.userId || 0,
      email: decoded.sub,
      name: decoded.name || '',
      role: roleClaim
    };
  }

  private initUserFromStorage() {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        this._user.set(JSON.parse(saved));
      } catch {
        this._user.set(null);
      }
    }
  }

  private clearSession() {
    this._user.set(null);
    localStorage.removeItem('user');
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue || null;
    }
    return null;
  }

  private decodeJwt(token: string): any {
    try {
      return jwt_decode(token);
    } catch {
      return null;
    }
  }

  private normalizeRole(role: string): string {
    return (role || '').trim().toLowerCase();
  }

  private handleError(err: any) {
    return throwError(() => err);
  }
}
