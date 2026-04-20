import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../core/services/auth.service';


@Component({
  standalone: true,
  selector: 'app-my-shop-info',
  imports: [CommonModule],
  templateUrl: './my-shop-info.component.html',
  styleUrls: ['./my-shop-info.component.scss']
})
export class MyShopInfoComponent {

  auth = inject(AuthService);
  router = inject(Router);

  // Lấy thông tin user từ AuthService (vì user có thể vừa là buyer vừa là shop)
  user = this.auth.user;

  // Fake dữ liệu cho Shop Info
  shopInfo = signal({
    shopName: 'Pet Kingdom Official',
    createdAt: '12/03/2025',
    description: 'Cửa hàng chuyên cung cấp thú cưng thuần chủng, thức ăn chất lượng cao và dịch vụ chăm sóc pet uy tín tại Hà Nội.',
    avatar: 'https://i.pravatar.cc/300?u=shop123' // Avatar của shop (có thể khác với user avatar)
  });

  editShopInfo() {
    // Điều hướng đến trang chỉnh sửa thông tin shop (sau này bạn sẽ tạo)
    this.router.navigate(['/my-shop'], {
      queryParams: { tab: 'edit-shop' }
    });
  }
}
