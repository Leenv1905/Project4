import { Component, ViewChild, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import {UserItemsComponent} from '../../shared/home-components/for-layouts/user-items/user-items.component';   // ← Import AuthService

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  rolesAllowed: string[];        // Thay vì role đơn giản
}

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    UserItemsComponent
  ]
})
export class AdminLayoutComponent {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  authService = inject(AuthService);

  // Lấy role từ AuthService
  currentRole = this.authService.role;   // 'admin' hoặc 'operators' hoặc 'user'...

  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin',
      rolesAllowed: ['admin', 'operators']
    },
    {
      label: 'Đơn hàng',
      icon: 'shopping_cart',
      rolesAllowed: ['admin', 'operators'],
      children: [
        { label: 'Danh sách đơn hàng', icon: 'list', route: '/admin/operators', rolesAllowed: ['admin', 'operators'] },
        { label: 'Chờ tiếp nhận', icon: 'pending', route: '/admin/orders/pending', rolesAllowed: ['admin', 'operators'] },
        { label: 'Đơn trả / hủy', icon: 'undo', route: '/admin/orders/returns', rolesAllowed: ['admin', 'operators'] },
        { label: 'Cài đặt vận chuyển', icon: 'local_shipping', route: '/admin/shipping-settings', rolesAllowed: ['admin', 'operators'] }
      ]
    },
    {
      label: 'Sản phẩm',
      icon: 'inventory_2',
      rolesAllowed: ['admin', 'operators'],
      children: [
        { label: 'Danh sách sản phẩm', icon: 'list_alt', route: '/admin/products', rolesAllowed: ['admin', 'operators'] },
        { label: 'Phân tích sản phẩm AI', icon: 'psychology', route: '/admin/products/analytics', rolesAllowed: ['admin', 'operators'] }
      ]
    },
    {
      label: 'Operator',
      icon: 'engineering',
      rolesAllowed: ['admin'],                    // Chỉ Admin mới thấy
      children: [
        { label: 'Danh sách Operator', icon: 'people', route: '/admin/operators/list', rolesAllowed: ['admin'] },
        { label: 'Thêm Operator', icon: 'person_add', route: '/admin/operators/add', rolesAllowed: ['admin'] },
        { label: 'Phân quyền', icon: 'admin_panel_settings', route: '/admin/operators/roles', rolesAllowed: ['admin'] }
      ]
    },
    {
      label: 'Khách hàng',
      icon: 'group',
      rolesAllowed: ['admin'],
      children: [
        { label: 'Danh sách khách hàng', icon: 'people_outline', route: '/admin/customers', rolesAllowed: ['admin'] },
        { label: 'Phân tích khách hàng', icon: 'analytics', route: '/admin/customers/analytics', rolesAllowed: ['admin'] }
      ]
    },
    {
      label: 'Tài Chính',
      icon: 'account_balance',
      rolesAllowed: ['admin'],                     // Chỉ Admin
      children: [
        { label: 'Doanh thu', icon: 'trending_up', route: '/admin/finance/revenue', rolesAllowed: ['admin'] },
        { label: 'Tài khoản ngân hàng', icon: 'account_balance_wallet', route: '/admin/finance/bank', rolesAllowed: ['admin'] },
        { label: 'Kênh thanh toán', icon: 'payment', route: '/admin/finance/payment', rolesAllowed: ['admin'] }
      ]
    },
    {
      label: 'Cài đặt chung',
      icon: 'settings',
      route: '/admin/settings',
      rolesAllowed: ['admin', 'operators']
    }
  ];

  // Lọc menu theo role hiện tại
  get visibleNavItems(): NavItem[] {
    const role = this.currentRole() || '';
    return this.navItems.filter(item =>
      item.rolesAllowed.includes(role)
    );
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}

// // admin-layout.component.ts
// import { Component } from '@angular/core';
// import { RouterOutlet, RouterLink } from '@angular/router';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatListModule } from '@angular/material/list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
//
// @Component({
//   standalone: true,
//   selector: 'app-admin-layout',
//   templateUrl: './admin-layout.component.html',
//   styleUrls: ['./admin-layout.component.scss'],
//   imports: [
//     RouterOutlet,
//     MatSidenavModule,
//     MatToolbarModule,
//     MatListModule,
//     MatIconModule,
//     MatButtonModule,
//     RouterLink
//   ]
// })
// export class AdminLayoutComponent {}
