import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MyShopSidebarComponent } from '../components/my-shop-sidebar/my-shop-sidebar.component';
import { MyShopDashboardComponent } from '../components/my-shop-dashboard/my-shop-dashboard.component';
import { MyShopProductsComponent } from '../components/my-shop-products/my-shop-products.component';
import { MyShopOrdersComponent } from '../components/my-shop-orders/my-shop-orders.component';
import { AddProductComponent } from '../components/add-product/add-product.component';
import { EditProductComponent } from '../components/edit-product/edit-product.component';
import { MyShopOrderDetailComponent } from '../components/my-shop-order-detail/my-shop-order-detail.component';
import {MyShopInfoComponent} from '../components/my-shop-info/my-shop-info.component';
import {MyShopEditInfoComponent} from '../components/my-shop-info/my-shop-info-edit/my-shop-edit-info.component';
import {MyShopRevenueComponent} from '../components/my-shop-revenue/my-shop-revenue.component';
import {MyShopReconciliationComponent} from '../components/my-shop-reconciliation/my-shop-reconciliation.component';
import {MyShopSettingsComponent} from '../components/my-shop-settings/my-shop-settings.component';

// Import các component mới
// import { AccountPaymentComponent } from '../components/account-payment/account-payment.component'; // tạm dùng nếu cần

type TabType =
  | 'dashboard'
  | 'products'
  | 'add-product'
  | 'orders'
  | 'pending-orders'
  | 'info'
  | 'edit-shop'
  | 'revenue'
  | 'reconciliation'
  | 'settings'
  | 'order-detail'
  | 'edit-product';

@Component({
  standalone: true,
  selector: 'app-my-shop-page',
  imports: [
    CommonModule,
    MyShopSidebarComponent,
    MyShopDashboardComponent,
    MyShopProductsComponent,
    MyShopOrdersComponent,
    AddProductComponent,
    EditProductComponent,
    MyShopOrderDetailComponent,
    MyShopInfoComponent,
    MyShopEditInfoComponent,
    MyShopRevenueComponent,
    MyShopReconciliationComponent,
    MyShopSettingsComponent,
    // Thêm các component khác
    // AccountPaymentComponent,
  ],
  templateUrl: './my-shop-page.component.html',
  styleUrls: ['./my-shop-page.component.scss']
})
export class MyShopPageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  // Tab hiện tại
  tab = signal<TabType>('dashboard');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'] as TabType | undefined;

      const validTabs: TabType[] = [
        'dashboard', 'products', 'add-product', 'orders', 'pending-orders',
        'info','edit-shop' , 'revenue', 'reconciliation', 'settings', 'order-detail', 'edit-product'
      ];

      // Nếu tab không hợp lệ thì mặc định về dashboard
      this.tab.set(validTabs.includes(tabParam!) ? tabParam! : 'dashboard');
    });
  }

  // Hàm chuyển tab
  setTab(tab: string) {
    const validTabs: TabType[] = [
      'dashboard', 'products', 'add-product', 'orders', 'pending-orders',
      'info','edit-shop' , 'revenue', 'reconciliation', 'settings', 'order-detail', 'edit-product'
    ];

    if (validTabs.includes(tab as TabType)) {
      this.tab.set(tab as TabType);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab },
        queryParamsHandling: 'merge'
      });
    }
  }
}
