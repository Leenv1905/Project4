import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  standalone: true,
  selector: 'app-my-shop-sidebar',
  imports: [CommonModule],
  templateUrl: './my-shop-sidebar.component.html',
  styleUrls: ['./my-shop-sidebar.component.scss']
})
export class MyShopSidebarComponent {

  @Input() active: string = 'dashboard';
  @Output() changeTab = new EventEmitter<string>();

  navGroups = [
    {
      title: 'Tổng quan',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' }
      ]
    },
    {
      title: 'Sản phẩm',
      items: [
        { id: 'products', label: 'Danh sách sản phẩm', icon: '🐶' },
        { id: 'add-product', label: 'Thêm sản phẩm mới', icon: '➕' }
      ]
    },
    {
      title: 'Đơn hàng',
      items: [
        { id: 'orders', label: 'Danh sách đơn hàng', icon: '📦' },
        { id: 'pending-orders', label: 'Chờ xử lý', icon: '⏳' }
      ]
    },
    {
      title: 'Cửa hàng',
      items: [
        { id: 'info', label: 'Thông tin cửa hàng', icon: '🏪' },
        { id: 'edit-shop', label: 'Chỉnh sửa thông tin', icon: '✏️' }
      ]
    },
    {
      title: 'Tài chính',
      items: [
        { id: 'revenue', label: 'Báo cáo doanh thu', icon: '📈' },
        { id: 'reconciliation', label: 'Đối soát thu chi', icon: '🔄' },
        { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
      ]
    }
  ];

  changeTabHandler(tabId: string) {
    this.changeTab.emit(tabId);
  }
}
