import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MOCK_ORDERS } from './mock-orders';
import { Router } from '@angular/router';
import {AccountOrderTimelineComponent} from '../account-order-timeline/account-order-timeline.component';

@Component({
  standalone: true,
  selector: 'app-account-orders',
  imports: [CommonModule, AccountOrderTimelineComponent],
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.scss']
})
export class AccountOrdersComponent {

  orders = signal(MOCK_ORDERS);

  activeTab = signal<'all' | 'pending' | 'shipping' | 'delivered' | 'cancelled'>('all');

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();

    return this.orders().filter(o => o.status === this.activeTab());
  });

  countByStatus(status: string) {
    return this.orders().filter(o => o.status === status).length;
  }

  cancel(id: number) {
    this.orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, status: 'cancelled' } : o
      )
    );
  }

  confirmReceived(id: number) {
    this.orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, status: 'delivered' } : o
      )
    );
  }

  router = inject(Router);
  goToDetail(id: number) {
    this.router.navigate(['/order', id]);
  }
}

// import { Component } from '@angular/core';
// import {DecimalPipe} from '@angular/common';
//
// @Component({
//   standalone: true,
//   selector: 'app-account-orders',
//   imports: [
//     DecimalPipe
//   ],
//   template: `
//     <h2>Đơn hàng của bạn</h2>
//
//     <div class="order" *ngFor="let o of orders">
//       Order #{{ o.id }} - {{ o.total | number }} ₫
//     </div>
//   `
// })
// export class AccountOrdersComponent {
//
//   orders = [
//     { id: 1, total: 5000000 },
//     { id: 2, total: 7000000 }
//   ];
//
// }
