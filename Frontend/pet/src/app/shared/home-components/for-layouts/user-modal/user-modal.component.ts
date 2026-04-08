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
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';

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
    MatSelect
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
  gender = 'male';

  constructor(public auth: AuthService) {}

  login() {
    this.auth.login(this.email, this.password);
  }

  register() {
    // Bạn có thể mở rộng sau
    console.log('Register:', this.name, this.regEmail, this.gender);
    this.auth.register();
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
