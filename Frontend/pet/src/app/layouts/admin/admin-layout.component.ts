import { Component, ViewChild, signal, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { UserItemsComponent } from '../../shared/home-components/for-layouts/user-items/user-items.component';   // ← Import AuthService

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
      rolesAllowed: ['admin', 'operator']
    },
    {
      label: 'Đơn hàng',
      icon: 'shopping_cart',
      rolesAllowed: ['admin', 'operator'],
      children: [
        { label: 'Danh sách đơn hàng', icon: 'list', route: '/admin/operators', rolesAllowed: ['admin', 'operator'] },
        { label: 'Chờ tiếp nhận', icon: 'pending', route: '/admin/orders/pending', rolesAllowed: ['admin', 'operator'] },
        { label: 'Đơn trả / hủy', icon: 'undo', route: '/admin/orders/returns', rolesAllowed: ['admin', 'operator'] }
      ]
    },
    {
      label: 'Sản phẩm',
      icon: 'inventory_2',
      rolesAllowed: ['admin', 'operator'],
      children: [
        { label: 'Danh sách sản phẩm', icon: 'list_alt', route: '/admin/products', rolesAllowed: ['admin', 'operator'] },
        { label: 'Xác minh chip (O2O)', icon: 'verified_user', route: '/admin/verifications', rolesAllowed: ['admin'] }
      ]
    },
    // ── Chỉ dành cho ADMIN ──────────────────────────────────────
    {
      label: 'Quản lý Operator',
      icon: 'engineering',
      rolesAllowed: ['admin'],
      children: [
        { label: 'Danh sách Operator', icon: 'people', route: '/admin/operators/list', rolesAllowed: ['admin'] },
        { label: 'Thêm Operator mới', icon: 'person_add', route: '/admin/operators/add', rolesAllowed: ['admin'] },
        { label: 'Giao việc xác minh', icon: 'assignment_ind', route: '/admin/operators/assign', rolesAllowed: ['admin'] }
      ]
    },
    {
      label: 'Người dùng',
      icon: 'group',
      rolesAllowed: ['admin'],
      children: [
        { label: 'Danh sách người dùng', icon: 'people_outline', route: '/admin/users', rolesAllowed: ['admin'] },
        { label: 'Thêm người dùng', icon: 'person_add', route: '/admin/users/add', rolesAllowed: ['admin'] }
      ]
    },
    {
      label: 'Tài Chính',
      icon: 'account_balance',
      rolesAllowed: ['admin'],
      children: [
        { label: 'Doanh thu', icon: 'monetization_on', route: '/admin/finance/revenue', rolesAllowed: ['admin'] },
        { label: 'Tài khoản ngân hàng', icon: 'account_balance_wallet', route: '/admin/finance/bank', rolesAllowed: ['admin'] },
        { label: 'Kênh thanh toán', icon: 'payments', route: '/admin/finance/payment', rolesAllowed: ['admin'] }
      ]
    },
    // ── Chung ───────────────────────────────────────────────────
    {
      label: 'Cài đặt',
      icon: 'settings',
      route: '/admin/settings',
      rolesAllowed: ['admin', 'operator']
    },
    {
      label: 'Quay lại Website',
      icon: 'home',
      route: '/',
      rolesAllowed: []
    }
  ];

  // Lọc menu theo role hiện tại (Bao gồm cả con) - Chuyển sang dùng Computed để đảm bảo tính reactive
  visibleNavItems = computed(() => {
    const userRoles = this.authService.normalizedRoles(); // Đã được normalize thành lowercase array
    console.log('DEBUG: User Roles in AdminLayout:', userRoles);
    
    return this.navItems
      .filter(item => this.checkAccess(item, userRoles))
      .map(item => {
        if (item.children) {
          const visibleChildren = item.children.filter(child => this.checkAccess(child, userRoles));
          return { ...item, children: visibleChildren.length > 0 ? visibleChildren : undefined };
        }
        return item;
      })
      .filter(item => {
        const originalItem = this.navItems.find(i => i.label === item.label);
        if (originalItem?.children && (!item.children || item.children.length === 0)) {
          return false;
        }
        return true;
      });
  });

  private checkAccess(item: NavItem, userRoles: string[]): boolean {
    if (!item.rolesAllowed || item.rolesAllowed.length === 0) return true;
    return item.rolesAllowed.some(role => userRoles.includes(role.toLowerCase()));
  }

  private openedItems = new Set<string>();

  toggleItem(label: string) {
    if (this.openedItems.has(label)) {
      this.openedItems.delete(label);
    } else {
      this.openedItems.add(label);
    }
  }

  isOpen(label: string): boolean {
    return this.openedItems.has(label);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}

