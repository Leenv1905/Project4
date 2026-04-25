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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { hasGoogleLogin } from '../../../../app.config';

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
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {
  readonly hasGoogleLogin = hasGoogleLogin;
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

  // Forgot Password
  isForgotPassword = false;
  forgotEmail = '';
  otp = '';
  newPassword = '';
  confirmNewPassword = '';
  otpSent = false;

  constructor(
    public auth: AuthService,
    private socialAuth: SocialAuthService,
    private snackBar: MatSnackBar
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.snackBar.open('Vui lòng nhập email và mật khẩu', 'Đóng', { duration: 3000 });
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
        const message =
          err?.error?.message ||
          err?.error ||
          'Sai tài khoản hoặc mật khẩu';
        this.snackBar.open(message, 'Đóng', { duration: 5000 });
      }
    });
  }

  register() {
    if (!this.name || !this.regEmail || !this.regPassword) {
      this.snackBar.open('Vui lòng điền đầy đủ họ tên, email và mật khẩu!', 'Đóng', { duration: 5000 });
      return;
    }
    if (this.regPassword !== this.confirmPassword) {
      this.snackBar.open('Mật khẩu xác nhận không khớp!', 'Đóng', { duration: 5000 });
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
          this.snackBar.open('Đăng ký thành công! Vui lòng đăng nhập.', 'Đóng', { duration: 5000 });
          this.tabIndex = 0;
          this.email = payload.email;
          this.password = '';
          this.regEmail = '';
          this.regPassword = '';
          this.confirmPassword = '';
          this.phone = '';
          this.address = '';
        } else {
          this.snackBar.open('Đăng ký thất bại: ' + (res?.message || 'Lỗi server'), 'Đóng', { duration: 5000 });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Lỗi đăng ký:', err);
        const message =
          err?.error?.message ||
          err?.error ||
          'Đăng ký thất bại hoặc email đã tồn tại!';
        this.snackBar.open(message, 'Đóng', { duration: 5000 });
      }
    });
  }

  loginWithGoogle() {
    if (!this.hasGoogleLogin) {
      this.snackBar.open('Google login chua duoc cau hinh.', 'Đóng', { duration: 5000 });
      return;
    }

    this.isLoading = true;
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: any) => {
      this.auth.loginWithGoogle(user.idToken).subscribe({
        next: () => {
          this.isLoading = false;
          this.auth.navigateAfterLogin();
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Lỗi đăng nhập Google:', err);
          this.snackBar.open('Đăng nhập Google thất bại', 'Đóng', { duration: 5000 });
        }
      });
    }).catch((err: any) => {
      this.isLoading = false;
      console.error('Lỗi SocialAuth:', err);
    });
  }

  loginWithFacebook() {
    this.snackBar.open('Đăng nhập với Facebook (chưa triển khai)', 'Đóng', { duration: 3000 });
  }

  registerWithGoogle() {
    this.snackBar.open('Đăng ký với Google (chưa triển khai)', 'Đóng', { duration: 3000 });
  }

  registerWithFacebook() {
    this.snackBar.open('Đăng ký với Facebook (chưa triển khai)', 'Đóng', { duration: 3000 });
  }

  forgotPassword(event: Event) {
    event.preventDefault();
    this.isForgotPassword = true;
  }

  sendOtp() {
    if (!this.forgotEmail) {
      this.snackBar.open('Vui lòng nhập email', 'Đóng', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    this.auth.forgotPassword(this.forgotEmail).subscribe({
      next: () => {
        this.isLoading = false;
        this.otpSent = true;
        this.snackBar.open('Mã OTP đã được gửi về email của bạn', 'Đóng', { duration: 5000 });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Gửi OTP thất bại: ' + (err?.error?.message || 'Lỗi server'), 'Đóng', { duration: 5000 });
      }
    });
  }

  verifyAndReset() {
    if (!this.otp || !this.newPassword || !this.confirmNewPassword) {
      this.snackBar.open('Vui lòng điền đầy đủ thông tin', 'Đóng', { duration: 3000 });
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.snackBar.open('Mật khẩu không khớp', 'Đóng', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    this.auth.resetPassword({
      email: this.forgotEmail,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Đặt lại mật khẩu thành công!', 'Đóng', { duration: 5000 });
        this.isForgotPassword = false;
        this.otpSent = false;
        this.forgotEmail = '';
        this.otp = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Lỗi: ' + (err?.error?.message || 'Không thể đặt lại mật khẩu'), 'Đóng', { duration: 5000 });
      }
    });
  }
}
