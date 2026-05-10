
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
  styleUrls: ['./my-shop-sidebar.component.scss'],
})
export class MyShopSidebarComponent {
  @Input() active: string = 'dashboard';
  @Output() changeTab = new EventEmitter<string>();

  navGroups = [
    {
      title: 'Overview',
      items: [{ id: 'dashboard', label: 'Dashboard', icon: '📊' }],
    },
    {
      title: 'Products',
      items: [
        { id: 'products', label: 'All Products', icon: '🐶' },
        { id: 'add-product', label: 'Add New Product', icon: '➕' },
      ],
    },
    {
      title: 'Orders',
      items: [
        { id: 'orders', label: 'All Orders', icon: '📦' },
        { id: 'pending-orders', label: 'Pending Orders', icon: '⏳' },
      ],
    },
    {
      title: 'Shop Management',
      items: [
        { id: 'info', label: 'Shop Information', icon: '🏪' },
        { id: 'edit-shop', label: 'Edit Shop', icon: '✏️' },
      ],
    },
    {
      title: 'Finance',
      items: [
        { id: 'revenue', label: 'Revenue Report', icon: '📈' },
        { id: 'reconciliation', label: 'Reconciliation', icon: '🔄' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
      ],
    },
  ];

  changeTabHandler(tabId: string) {
    this.changeTab.emit(tabId);
  }
}
