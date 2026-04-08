import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = signal<User | null>(null);

  user = this._user;
// ===== ROLE HELPERS =====
  // đã login
  isAuthenticated = computed(() => !!this._user());

// role hiện tại
  role = computed(() => this._user()?.role);

// quyền admin
  canAccessAdmin = computed(() =>
    ['admin', 'operators'].includes(this._user()?.role || '')
  );

// quyền home (thực ra tất cả role đều vào được)
  canAccessHome = computed(() =>
    ['user', 'shop', 'admin', 'operators'].includes(this._user()?.role || '')
  );
  // ===== MODAL =====
  private _showLoginModal = signal(false);

  showLoginModal = this._showLoginModal;

  openLogin() {
    this._showLoginModal.set(true);
  }

  closeLogin() {
    this._showLoginModal.set(false);
  }

  // ===== MOCK USERS =====
  private mockUsers: User[] = [
    {
      id: 1,
      email: 'user@gmail.com',
      name: 'User',
      role: 'user'
    },
    {
      id: 2,
      email: 'shop@gmail.com',
      name: 'Shop Owner',
      role: 'shop'
    },
    {
      id: 3,
      email: 'admin@gmail.com',
      name: 'Admin',
      role: 'admin'
    },
    {
      id: 4,
      email: 'op@gmail.com',
      name: 'Operator',
      role: 'operators'
    }
  ];

  // ===== LOGIN =====

  router = inject(Router);
  login(email: string, password: string) {

    const found = this.mockUsers.find(u => u.email === email);

    if (!found) {
      alert('Sai tài khoản');
      return;
    }

    this._user.set(found);
    this.closeLogin();

    // Redirect theo role
    if (['admin', 'operators'].includes(found.role)) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  // ===== LOGOUT =====
  logout() {
    this._user.set(null);
    localStorage.removeItem('user');
      this.router.navigate(['/']);
  }

  // ===== REGISTER (mock) =====
  register() {
    alert('Register chưa implement');
  }

  // ===== LOCAL STORAGE =====
  constructor() {

    // load user
    const saved = localStorage.getItem('user');
    if (saved) {
      this._user.set(JSON.parse(saved));
    }

    // save user
    effect(() => {
      const user = this._user();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    });

  }

}
