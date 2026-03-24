import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountSidebarComponent } from '../../components/account-sidebar/account-sidebar.component';
import { AccountOrdersComponent } from '../../components/account-orders/account-orders.component';
import { AccountInfoComponent } from '../../components/account-info/account-info.component';
import { AccountPaymentComponent } from '../../components/account-payment/account-payment.component';

@Component({
  standalone: true,
  selector: 'app-account-page',
  imports: [
    CommonModule,
    AccountSidebarComponent,
    AccountOrdersComponent,
    AccountInfoComponent,
    AccountPaymentComponent
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);

  tab = signal<'orders' | 'info' | 'payment'>('orders');

  ngOnInit() {
    // Lấy tab từ url khi component được khởi tạo
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'orders';
      // Default tab khi chưa có query là về orders
      this.tab.set(tab);
    });
  }

  setTab(tab: 'orders' | 'info' | 'payment') {

    this.tab.set(tab);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab }
    });

  }



}
