import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfileService, RegisterSellerPayload } from '../../../../../core/services/user-profile.service';
import { NotificationModalComponent } from '../../../../../shared/notification-modal/notification-modal.component';

@Component({
  standalone: true,
  selector: 'app-account-seller-register',
  imports: [CommonModule, FormsModule, NotificationModalComponent],
  templateUrl: './account-seller-register.component.html',
  styleUrls: ['./account-seller-register.component.scss']

})
export class AccountSellerRegisterComponent {
  private userProfileService = inject(UserProfileService);
  private router = inject(Router);

  // Khởi tạo object theo cấu trúc RegisterSellerRequest ở Backend
  sellerData: RegisterSellerPayload = {
    displayName: '',
    sellerType: 'INDIVIDUAL',
    bio: '',
    taxCode: ''
  };

  isLoading = false;
  errorMessage = '';
  modal: { title: string; message: string; type: 'success' | 'error' | 'info' } | null = null;

  onSubmit() {
    if (!this.sellerData.displayName) {
      this.errorMessage = 'Vui lòng nhập tên cửa hàng';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userProfileService.registerSeller(this.sellerData)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.modal = { title: 'Thành công', message: 'Đăng ký bán hàng thành công! Vui lòng đăng nhập lại để cập nhật quyền.', type: 'success' };
        },
        error: (err) => {
          this.isLoading = false;
          this.modal = { title: 'Lỗi', message: err.error?.message || 'Có lỗi xảy ra khi đăng ký.', type: 'error' };
        }
      });
  }

  onModalClosed() {
    if (this.modal?.type === 'success') {
      window.location.reload();
    }
    this.modal = null;
  }
}
