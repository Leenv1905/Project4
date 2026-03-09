import { Injectable, signal } from '@angular/core';

export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = signal(false);
  private _showLoginModal = signal(false);
  private _role = signal<Role>('ROLE_USER');

  isAuthenticated() {
    return this._isAuthenticated();
  }

  role() {
    return this._role();
  }

  showLoginModal() {
    return this._showLoginModal();
  }

  openLogin() {
    this._showLoginModal.set(true);
  }

  closeLogin() {
    this._showLoginModal.set(false);
  }

  login(email: string, password: string) {
    // MOCK LOGIN
    this._isAuthenticated.set(true);
    this._role.set(email.includes('admin') ? 'ROLE_ADMIN' : 'ROLE_USER');
    this.closeLogin();
  }

  register() {
    this._isAuthenticated.set(true);
    this.closeLogin();
  }

  logout() {
    this._isAuthenticated.set(false);
  }
}
