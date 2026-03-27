import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AccountOrderTimelineComponent } from '../account-order-timeline/account-order-timeline.component';
import { OrderService } from '../../../../core/services/order.service';
import { ORDER_STATUS_CONFIG } from '../../../../core/constants/order-status.constant';
import { getStatusLabel } from '../../../../core/utils/order-status.util';
import { OrderStatus } from '../../../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-account-orders',
  imports: [CommonModule, AccountOrderTimelineComponent],
  templateUrl: './account-orders.component.html',
  styleUrls: ['./account-orders.component.scss']
})
export class AccountOrdersComponent {

  orderService = inject(OrderService);
  router = inject(Router);

  orders = this.orderService.orders;

  statuses = ORDER_STATUS_CONFIG;
  getStatusLabel = getStatusLabel;

  activeTab = signal<OrderStatus | 'all'>('all');

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();
    return this.orders().filter(o => o.status === this.activeTab());
  });

  countByStatus(status: OrderStatus) {
    return this.orders().filter(o => o.status === status).length;
  }

  cancel(id: number) {
    this.orderService.updateStatus(id, 'cancelled');
  }

  confirmReceived(id: number) {
    this.orderService.updateStatus(id, 'completed');
  }
  // Phân tách với delivered của operators

  goToDetail(id: number) {
    this.router.navigate(['/order', id]);
  }

}
