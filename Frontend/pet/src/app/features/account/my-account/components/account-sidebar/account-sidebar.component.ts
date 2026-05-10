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
        title: 'ORDER MANAGEMENT',
        items: [{ id: 'orders', label: 'My Orders', icon: '📦' }],
      },
      {
        title: 'ACCOUNT',
        items: [{ id: 'info', label: 'Account Information', icon: '👤' }],
      },
      // THÊM MÃ MỚI: Nhóm dành cho Người bán
      {
        title: 'MY SHOP',
        items: [
          this.isSeller
            ? { id: 'seller-channel', label: 'Seller Dashboard', icon: '🏪' }
            : { id: 'seller-register', label: 'Become a Seller', icon: '🚀' },
        ],
      },
      {
        title: 'FINANCE',
        items: [
          { id: 'payment', label: 'Payment Methods', icon: '💳' },
          { id: 'wallet', label: 'My Wallet', icon: '💰' },
        ],
      },
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
