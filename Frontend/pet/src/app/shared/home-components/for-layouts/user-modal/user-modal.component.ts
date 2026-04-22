import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../../../../core/services/auth.service';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-user-modal',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatOption,
    MatSelect,
    MatIconModule
  ],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  tabIndex = 0;

  // Login
  email = '';
  password = '';
  rememberMe = false;

  // Register
  name = '';
  regEmail = '';
  regPassword = '';
  confirmPassword = '';
  phone = '';
  address = '';

  // UI States
  hidePassword = true;
  hideRegPassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(public auth: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      alert('Vui lòng nhập email và mật khẩu');
      return;
    }

    this.isLoading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.auth.navigateAfterLogin();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Lỗi đăng nhập:', err);
        alert('Sai tài khoản hoặc mật khẩu');
      }
    });
  }

  register() {
    if (!this.name || !this.regEmail || !this.regPassword) {
      alert('Vui lòng điền đầy đủ họ tên, email và mật khẩu!');
      return;
    }
    if (this.regPassword !== this.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    this.isLoading = true;
    const payload = {
      name: this.name,
      email: this.regEmail,
      password: this.regPassword,
      phone: this.phone,
      address: this.address
    };

    this.auth.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.status === 200) {
          alert('Đăng ký thành công! Vui lòng đăng nhập.');
          this.tabIndex = 0;
          this.email = payload.email;
          this.password = '';
          this.regEmail = '';
          this.regPassword = '';
          this.confirmPassword = '';
          this.phone = '';
          this.address = '';
        } else {
          alert('Đăng ký thất bại: ' + (res?.message || 'Lỗi server'));
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Lỗi đăng ký:', err);
        alert('Đăng ký thất bại hoặc email đã tồn tại!');
      }
    });
  }

  loginWithGoogle() {
    alert('Đăng nhập với Google (chưa triển khai)');
  }

  loginWithFacebook() {
    alert('Đăng nhập với Facebook (chưa triển khai)');
  }

  registerWithGoogle() {
    alert('Đăng ký với Google (chưa triển khai)');
  }

  registerWithFacebook() {
    alert('Đăng ký với Facebook (chưa triển khai)');
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    alert('Chức năng quên mật khẩu chưa triển khai');
  }
}
