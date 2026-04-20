import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  group?: string;        // Để nhóm các tab
}

@Component({
  standalone: true,
  selector: 'app-account-sidebar',
  imports: [CommonModule],
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent {

  @Input() activeTab: string = 'orders';
  @Output() tabChange = new EventEmitter<string>();

  // Khai báo tabs dưới dạng dữ liệu → dễ quản lý sau này (có thể lấy từ API)
  navGroups = [
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
    {
      title: 'Tài chính',
      items: [
        { id: 'payment', label: 'Kênh thanh toán', icon: '💳' },
        { id: 'wallet', label: 'Ví của tôi', icon: '💰' }
      ]
    }
  ];

  changeTab(tabId: string) {
    this.tabChange.emit(tabId);
  }
}
