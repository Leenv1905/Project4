import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

import { AccountSidebarComponent } from '../components/account-sidebar/account-sidebar.component';
import { AccountOrdersComponent } from '../components/account-orders/account-orders.component';
import { AccountInfoComponent } from '../components/account-info/account-info.component';
import { AccountPaymentComponent } from '../components/account-payment/account-payment.component';
import {AccountEditComponent} from '../components/account-info/edit-info/account-edit.component';
import {AccountSellerRegisterComponent} from '../components/account-seller-register/account-seller-register.component';
import { AccountWalletComponent } from '../components/account-wallet/account-wallet.component';

type TabType = 'orders' | 'info' | 'payment' | 'wallet' | 'edit' | 'seller-register' | 'seller-channel';
@Component({
  standalone: true,
  selector: 'app-account-page',
  imports: [
    CommonModule,
    AccountSidebarComponent,
    AccountOrdersComponent,
    AccountInfoComponent,
    AccountPaymentComponent,
    AccountEditComponent,
    AccountSellerRegisterComponent,
    AccountWalletComponent
  ],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss'],
})
export class AccountPageComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  // tab hiện tại, mặc định là 'orders'
  tab = signal<TabType>('orders');

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tabParam = params['tab'] as TabType | undefined;

      const validTabs: TabType[] = [
        'orders',
        'info',
        'payment',
        'wallet',
        'edit',
        'seller-register',
        'seller-channel',
      ];
      this.tab.set(validTabs.includes(tabParam!) ? tabParam! : 'orders');
    });
  }

  // Chấp nhận string rồi convert sang TabType
  setTab(tab: string) {
    const validTabs: TabType[] = [
      'orders',
      'info',
      'payment',
      'wallet',
      'edit',
      'seller-register',
      'seller-channel',
    ];

    if (validTabs.includes(tab as TabType)) {
      this.tab.set(tab as TabType);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab },
        queryParamsHandling: 'merge',
      });
    }
  }
}
