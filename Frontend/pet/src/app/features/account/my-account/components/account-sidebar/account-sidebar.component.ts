import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-account-sidebar',
  imports: [CommonModule],
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent {
  @Input() activeTab: string = 'orders';
  @Input() isSeller: boolean = false; // Thêm mã mới này để nhận trạng thái từ cha
  @Output() tabChange = new EventEmitter<string>();

  private router = inject(Router);

  // Biến navGroups cũ được giữ nguyên cấu trúc nhưng thêm logic lựa chọn item
  get navGroups() {
    return [
      {
        title: 'Quản lý đơn hàng',
        items: [
          { id: 'orders', label: 'Đơn hàng của tôi', icon: '📦' }
        ]
      },
      {
        title: 'Thông tin cá nhân',
        items: [
          { id: 'info', label: 'Thông tin tài khoản', icon: '👤' }
        ]
      },
      // THÊM MÃ MỚI: Nhóm dành cho Người bán
      {
        title: 'Cửa hàng',
        items: [
          this.isSeller
            ? { id: 'seller-channel', label: 'Kênh người bán', icon: '🏪' }
            : { id: 'seller-register', label: 'Đăng ký bán hàng', icon: '🚀' }
        ]
      },
      {
        title: 'Tài chính',
        items: [
          { id: 'payment', label: 'Kênh thanh toán', icon: '💳' },
          { id: 'wallet', label: 'Ví của tôi', icon: '💰' }
        ]
      }
    ];
  }

  changeTab(tabId: string) {
    if (tabId === 'seller-channel') {
      this.router.navigate(['/my-shop']);
      return;
    }
    this.tabChange.emit(tabId);
  }
}
