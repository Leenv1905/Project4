import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MyShopOrdersComponent} from '../components/my-shop-orders/my-shop-orders.component';
import {MyShopSidebarComponent} from '../components/my-shop-sidebar/my-shop-sidebar.component';
import {MyShopDashboardComponent} from '../components/my-shop-dashboard/my-shop-dashboard.component';
import {MyShopProductsComponent} from '../components/my-shop-products/my-shop-products.component';
import {AddProductComponent} from '../components/add-product/add-product.component';
import {EditProductComponent} from '../components/edit-product/edit-product.component';
import {MyShopOrderDetailComponent} from '../components/my-shop-order-detail/my-shop-order-detail.component';

// import { MyShopInfoComponent } from '../components/my-shop/my-shop-info.component';

@Component({
  standalone: true,
  selector: 'app-my-shop-page',
  imports: [
    CommonModule,
    MyShopSidebarComponent,
    MyShopDashboardComponent,
    MyShopProductsComponent,
    MyShopOrdersComponent,
    // MyShopInfoComponent,
    AddProductComponent,
    EditProductComponent,
    MyShopOrderDetailComponent
  ],
  templateUrl: './my-shop-page.component.html',
  styleUrls: ['./my-shop-page.component.scss']
})
export class MyShopPageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  tab = signal<'dashboard' | 'products' | 'orders' | 'info' | 'add-product' | 'edit-product' | 'order-detail'>('dashboard');

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
