import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../../core/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-my-shop-edit-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './my-shop-edit-info.component.html',
  styleUrls: ['./my-shop-edit-info.component.scss']
})
export class MyShopEditInfoComponent {

  auth = inject(AuthService);
  router = inject(Router);

  // Form dữ liệu chỉnh sửa
  editForm = signal({
    shopName: 'Pet Kingdom Official',
    phone: '0966 228 008',
    address: 'Hậu Dưỡng, Thiện Lộc, Hà Nội',
    description: 'Cửa hàng chuyên cung cấp thú cưng thuần chủng, thức ăn chất lượng cao và dịch vụ chăm sóc pet uy tín tại Hà Nội.'
  });

  // Avatar cửa hàng
  shopAvatar = signal('https://i.pravatar.cc/300?u=shop123');

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.shopAvatar.set(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges() {
    if (!this.editForm().shopName || !this.editForm().phone || !this.editForm().address) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }

    // Sau này sẽ gọi API update shop info
    alert('✅ Thông tin cửa hàng đã được cập nhật thành công!');

    // Quay về trang thông tin cửa hàng
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'info' } });
  }

  cancel() {
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'info' } });
  }
}
