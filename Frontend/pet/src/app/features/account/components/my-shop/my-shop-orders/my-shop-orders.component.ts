import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from '../../../../../core/services/order.service';
import { ORDER_STATUS_CONFIG } from '../../../../../core/constants/order-status.constant';
import { OrderStatus } from '../../../../../core/models/order.model';
import { getStatusLabel } from '../../../../../core/utils/order-status.util';

@Component({
  standalone: true,
  selector: 'app-my-shop-orders',
  imports: [CommonModule],
  templateUrl: './my-shop-orders.component.html',
  styleUrls: ['./my-shop-orders.component.scss']
})
export class MyShopOrdersComponent {

  orderService = inject(OrderService);

  orders = this.orderService.orders;
  statuses = ORDER_STATUS_CONFIG;
  getStatusLabel = getStatusLabel;

  activeTab = signal<OrderStatus | 'all'>('pending');

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();
    return this.orders().filter(o => o.status === this.activeTab());
  });

  count(status: OrderStatus) {
    return this.orders().filter(o => o.status === status).length;
  }

  confirmOrder(id: number) {
    this.orderService.updateStatus(id, 'confirmed');
  }

  rejectOrder(id: number) {
    this.orderService.updateStatus(id, 'cancelled');
  }

}
