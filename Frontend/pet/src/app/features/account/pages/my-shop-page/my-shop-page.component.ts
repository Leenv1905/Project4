import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MyShopSidebarComponent } from '../../components/my-shop/my-shop-sidebar/my-shop-sidebar.component';
import { MyShopDashboardComponent } from '../../components/my-shop/my-shop-dashboard/my-shop-dashboard.component';
import {MyShopOrdersComponent} from '../../components/my-shop/my-shop-orders/my-shop-orders.component';
// import { MyShopProductsComponent } from '../components/my-shop/my-shop-products.component';
// import { MyShopInfoComponent } from '../components/my-shop/my-shop-info.component';

@Component({
  standalone: true,
  selector: 'app-my-shop-page',
  imports: [
    CommonModule,
    MyShopSidebarComponent,
    MyShopDashboardComponent,
    // MyShopProductsComponent,
    MyShopOrdersComponent,
    // MyShopInfoComponent
  ],
  templateUrl: './my-shop-page.component.html',
  styleUrls: ['./my-shop-page.component.scss']
})
export class MyShopPageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  tab = signal<'dashboard' | 'products' | 'orders' | 'info'>('dashboard');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tab.set(params['tab'] || 'dashboard');
    });
  }

  setTab(tab: 'dashboard' | 'products' | 'orders' | 'info') {
    this.tab.set(tab);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab }
    });
  }

}
