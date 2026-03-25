import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MOCK_ORDERS} from '../../account-orders/mock-orders';
import {Order} from '../../../../../shared/models/order.model';

@Component({
  standalone: true,
  selector: 'app-my-shop-orders',
  imports: [CommonModule],
  templateUrl: './my-shop-orders.component.html',
  styleUrls: ['./my-shop-orders.component.scss']
})
export class MyShopOrdersComponent {

  orders = signal<Order[]>(MOCK_ORDERS);

  activeTab = signal<'all' | 'pending' | 'confirmed'>('pending');

  filteredOrders = computed(() => {

    if (this.activeTab() === 'all') return this.orders();

    return this.orders().filter(o => o.status === this.activeTab());

  });

  count(status: string) {
    return this.orders().filter(o => o.status === status).length;
  }

  // ✅ SHOP ACTIONS

  confirmOrder(id: number) {
    this.orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, status: 'confirmed' } : o
      )
    );
  }

  rejectOrder(id: number) {
    this.orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, status: 'cancelled' } : o
      )
    );
  }

}
