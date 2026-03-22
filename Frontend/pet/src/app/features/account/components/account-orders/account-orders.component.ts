import { Component } from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-account-orders',
  imports: [
    DecimalPipe
  ],
  template: `
    <h2>Đơn hàng của bạn</h2>

    <div class="order" *ngFor="let o of orders">
      Order #{{ o.id }} - {{ o.total | number }} ₫
    </div>
  `
})
export class AccountOrdersComponent {

  orders = [
    { id: 1, total: 5000000 },
    { id: 2, total: 7000000 }
  ];

}
