import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-info',
  imports: [CommonModule],
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent {

  auth = inject(AuthService);
  router = inject(Router);

  // Dữ liệu user (lấy từ AuthService)
  user = this.auth.user;

  // Giả lập một số thông tin bổ sung (sau này sẽ lấy từ API)
  userInfo = signal({
    dateOfBirth: '15/03/1995',
    avatar: 'https://i.pravatar.cc/150?u=user123'   // Avatar mặc định
  });

  editProfile() {
    // Điều hướng đến trang chỉnh sửa (tab edit)
    this.router.navigate(['/account'], {
      queryParams: { tab: 'edit' }
    });
  }

  // Helper để hiển thị mật khẩu dạng chấm
  getMaskedPassword(): string {
    return '••••••••••';
  }
}
