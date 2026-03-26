import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MOCK_ORDERS} from '../../../../../core/mock/mock-orders';
import {Order} from '../../../../../core/models/order.model';
import {OrderService} from '../../../../../core/services/order.service';


@Component({
  standalone: true,
  selector: 'app-my-shop-orders',
  imports: [CommonModule],
  templateUrl: './my-shop-orders.component.html',
  styleUrls: ['./my-shop-orders.component.scss']
})
export class MyShopOrdersComponent {
  orderService = inject(OrderService);
  // orders = signal<Order[]>(MOCK_ORDERS); - BẢN CŨ DÙNG MOCK
  orders = this.orderService.orders;

  activeTab = signal<'all' | 'pending' | 'confirmed'>('pending');

  filteredOrders = computed(() => {

    if (this.activeTab() === 'all') return this.orders();

    return this.orders().filter(o => o.status === this.activeTab());

  });

  count(status: string) {
    return this.orders().filter(o => o.status === status).length;
  }

  // SHOP ACTIONS BẢN CŨ DÙNG MOCK

  // confirmOrder(id: number) {
  //   this.orders.update(list =>
  //     list.map(o =>
  //       o.id === id ? { ...o, status: 'confirmed' } : o
  //     )
  //   );
  // }

  // rejectOrder(id: number) {
  //   this.orders.update(list =>
  //     list.map(o =>
  //       o.id === id ? { ...o, status: 'cancelled' } : o
  //     )
  //   );
  // }
  confirmOrder(id: number) {
    this.orderService.updateStatus(id, 'confirmed');
  }

  rejectOrder(id: number) {
    this.orderService.updateStatus(id, 'cancelled');
  }
}
