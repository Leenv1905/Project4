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
import { UserItemsComponent } from '../../shared/home-components/for-layouts/user-items/user-items.component';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
  rolesAllowed: string[];
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
    UserItemsComponent,
  ],
})
export class AdminLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  authService = inject(AuthService);

  // Navigation Items (English)
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin',
      rolesAllowed: ['admin', 'operator'],
    },
    {
      label: 'Orders',
      icon: 'shopping_cart',
      rolesAllowed: ['admin', 'operator'],
      children: [
        {
          label: 'All Orders',
          icon: 'list',
          route: '/admin/orders',
          rolesAllowed: ['admin', 'operator'],
        },
        {
          label: 'Pending Orders',
          icon: 'pending',
          route: '/admin/orders/pending',
          rolesAllowed: ['admin', 'operator'],
        },
        {
          label: 'Returns & Cancellations',
          icon: 'undo',
          route: '/admin/orders/returns',
          rolesAllowed: ['admin', 'operator'],
        },
      ],
    },
    {
      label: 'Products',
      icon: 'inventory_2',
      rolesAllowed: ['admin', 'operator'],
      children: [
        {
          label: 'All Products',
          icon: 'list_alt',
          route: '/admin/products',
          rolesAllowed: ['admin', 'operator'],
        },
        {
          label: 'Chip Verification (O2O)',
          icon: 'verified_user',
          route: '/admin/verifications',
          rolesAllowed: ['admin'],
        },
      ],
    },
    // Admin Only
    {
      label: 'Operator',
      icon: 'engineering',
      rolesAllowed: ['admin'],
      children: [
        {
          label: 'Operator List',
          icon: 'people',
          route: '/admin/operators/list',
          rolesAllowed: ['admin'],
        },
        {
          label: 'Add New Operator',
          icon: 'person_add',
          route: '/admin/operators/add',
          rolesAllowed: ['admin'],
        },
        {
          label: 'Assign Verification Tasks',
          icon: 'assignment_ind',
          route: '/admin/operators/assign',
          rolesAllowed: ['admin'],
        },
      ],
    },
    {
      label: 'Users',
      icon: 'group',
      rolesAllowed: ['admin'],
      children: [
        {
          label: 'User List',
          icon: 'people_outline',
          route: '/admin/users',
          rolesAllowed: ['admin'],
        },
        {
          label: 'Add New User',
          icon: 'person_add',
          route: '/admin/users/add',
          rolesAllowed: ['admin'],
        },
      ],
    },
    {
      label: 'Finance',
      icon: 'account_balance',
      rolesAllowed: ['admin'],
      children: [
        {
          label: 'Revenue Report',
          icon: 'monetization_on',
          route: '/admin/finance/revenue',
          rolesAllowed: ['admin'],
        },
        {
          label: 'Bank Accounts',
          icon: 'account_balance_wallet',
          route: '/admin/finance/bank',
          rolesAllowed: ['admin'],
        },
        {
          label: 'Payment Channels',
          icon: 'payments',
          route: '/admin/finance/payment',
          rolesAllowed: ['admin'],
        },
      ],
    },
    // Common
    {
      label: 'Settings',
      icon: 'settings',
      route: '/admin/settings',
      rolesAllowed: ['admin', 'operator'],
    },
    {
      label: 'Back to Website',
      icon: 'home',
      route: '/',
      rolesAllowed: [],
    },
  ];

  // Filter menu based on user role (reactive)
  visibleNavItems = computed(() => {
    const userRoles = this.authService.normalizedRoles();

    return this.navItems
      .filter((item) => this.checkAccess(item, userRoles))
      .map((item) => {
        if (item.children) {
          const visibleChildren = item.children.filter((child) =>
            this.checkAccess(child, userRoles),
          );
          return { ...item, children: visibleChildren.length > 0 ? visibleChildren : undefined };
        }
        return item;
      })
      .filter((item) => {
        const originalItem = this.navItems.find((i) => i.label === item.label);
        if (originalItem?.children && (!item.children || item.children.length === 0)) {
          return false;
        }
        return true;
      });
  });

  private checkAccess(item: NavItem, userRoles: string[]): boolean {
    if (!item.rolesAllowed || item.rolesAllowed.length === 0) return true;
    return item.rolesAllowed.some((role) => userRoles.includes(role.toLowerCase()));
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
