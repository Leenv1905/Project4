import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user;

  isAuthenticated = computed(() => !!this._user());

  normalizedRoles = computed(() => this.extractRoles(this._user()?.role || ''));

  role = computed(() => this.normalizedRoles()[0] || '');

  canAccessAdmin = computed(() => {
    const roles = this.normalizedRoles();
    return roles.includes('admin') || roles.includes('operators');
  });

  canAccessHome = computed(() => {
    const roles = this.normalizedRoles();
    return roles.some((r) => ['user', 'shop', 'admin', 'operators'].includes(r));
  });

  isAdmin = computed(() => this.hasAnyRole(['admin']));
  isOperator = computed(() => this.hasAnyRole(['operators']));
  isShop = computed(() => this.hasAnyRole(['shop']));
  isUser = computed(() => this.hasAnyRole(['user']));
  isStaff = computed(() => this.hasAnyRole(['admin', 'operators']));

  private _showLoginModal = signal(false);
  showLoginModal = this._showLoginModal;

  private http = inject(HttpClient);
  router = inject(Router);
  private apiUrl = 'http://localhost:8080/gupet/v1/auth/user';

  constructor() {
    this.initUserFromStorage();

    this.loadCurrentUser().subscribe({
      next: () => { },
      error: () => { }
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

  loginWithGoogle(idToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/google`, { idToken }, { withCredentials: true }).pipe(
      tap((res) => {
        if (res && res.status === 200 && res.data) {
          const found: User = {
            id: res.data.userId,
            email: '',
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

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email }, { withCredentials: true }).pipe(
      catchError((err) => this.handleError(err))
    );
  }

  resetPassword(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, payload, { withCredentials: true }).pipe(
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

    if (this.canAccessAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  hasRole(requiredRole: string): boolean {
    return this.normalizedRoles().includes(this.normalizeRole(requiredRole));
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    const roles = this.normalizedRoles();
    return requiredRoles.some((r) => roles.includes(this.normalizeRole(r)));
  }

  updateLocalUser(partial: Partial<User>) {
    const current = this._user();
    if (!current) {
      return;
    }

    this._user.set({
      ...current,
      ...partial
    });
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

  private extractRoles(roleValue: any): string[] {
    if (!roleValue) return [];
    
    // Nếu là string thì split
    if (typeof roleValue === 'string') {
      return roleValue
        .split(',')
        .map((r) => this.normalizeRole(r))
        .filter(Boolean);
    }
    
    // Nếu là array thì map và normalize từng phần tử
    if (Array.isArray(roleValue)) {
      return roleValue
        .map((r) => (typeof r === 'string' ? this.normalizeRole(r) : ''))
        .filter(Boolean);
    }
    
    return [];
  }


  private normalizeRole(role: string): string {
    return (role || '').trim().toLowerCase();
  }

  private handleError(err: any) {
    return throwError(() => err);
  }
}
