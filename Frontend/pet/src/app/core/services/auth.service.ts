import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = signal<User | null>(null);
  user = this._user;

  private readonly _authReady$ = new BehaviorSubject<boolean>(false);
  readonly authReady$ = this._authReady$.asObservable().pipe(filter(Boolean), take(1));

  isAuthenticated = computed(() => !!this._user());

  normalizedRoles = computed(() => this.extractRoles(this._user()?.role || ''));

  role = computed(() => this.normalizedRoles()[0] || '');

  canAccessAdmin = computed(() => {
    const roles = this.normalizedRoles();
    return roles.includes('admin') || roles.includes('operator');
  });

  canAccessHome = computed(() => {
    const roles = this.normalizedRoles();
    return roles.some((r) => ['user', 'buyer', 'seller', 'shop', 'admin', 'operator'].includes(r));
  });

  isAdmin = computed(() => this.hasAnyRole(['admin']));
  isOperator = computed(() => this.hasAnyRole(['operator']));
  isShop = computed(() => this.hasAnyRole(['seller', 'shop']));
  isUser = computed(() => this.hasAnyRole(['user', 'buyer', 'role_buyer']));
  isStaff = computed(() => this.hasAnyRole(['admin', 'operator']));
  isSeller = computed(() => this.hasAnyRole(['seller']));

  private _showLoginModal = signal(false);
  showLoginModal = this._showLoginModal;

  private http = inject(HttpClient);
  router = inject(Router);
  private readonly apiUrl = `${environment.apiBaseUrl}/v1/auth/user`;

  constructor() {
    this.initUserFromStorage();

    this.loadCurrentUser().subscribe({
      next: () => { this._authReady$.next(true); },
      error: () => { this._authReady$.next(true); }
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
    return this.http.post(`${this.apiUrl}/refresh`, {}, { withCredentials: true, responseType: 'text' });
  }

  forceLogout() {
    this.clearSession();
    this.router.navigate(['/']);
  }

  loadCurrentUser(): Observable<User | null> {
    return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      map((res) => {
        // BE trả về ApiSuccessResponse wrapper: { status, message, data: { userId, name, role, ... } }
        const data = res?.data ?? res;
        if (!data) return null;

        const me: User = {
          id: data.userId ?? data.id,
          email: data.email || '',
          name: data.name,
          role: data.role,
          phone: data.phone,
          address: data.address,
          avatarUrl: data.avatarUrl
        };
        this._user.set(me);
        return me;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err?.status === 401) {
          this._user.set(null);
        }
        return of(null);
      })
    );
  }

  navigateAfterLogin(returnUrl?: string | null) {
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    if (this.isAdmin()) {
      this.router.navigate(['/admin']);
    } else if (this.isOperator()) {
      this.router.navigate(['/operator/tasks/verify']);
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
