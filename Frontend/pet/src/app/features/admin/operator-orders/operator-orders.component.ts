import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {OrderService} from '../../../core/services/order.service';
import {FulfillmentStatus} from '../../../core/models/order.model';


@Component({
  standalone: true,
  selector: 'app-operator-orders',
  imports: [CommonModule],
  templateUrl: './operator-orders.component.html',
  styleUrls: ['./operator-orders.component.scss']
})
export class OperatorOrdersComponent {

  private orderService = inject(OrderService);

  orders = this.orderService.orders;

  statuses: (FulfillmentStatus | 'all')[] = [
    'pending',
    'received',
    'delivering',
    'delivered',
    'return_pending',
    'returned',
    'all'
  ];

  activeTab = signal<FulfillmentStatus | 'all'>('pending');

  filteredOrders = computed(() => {

    if (this.activeTab() === 'all') return this.orders();

    return this.orders().filter(
      o => o.fulfillmentStatus === this.activeTab()
    );

  });

  count(status: FulfillmentStatus) {
    return this.orders().filter(o => o.fulfillmentStatus === status).length;
  }

  // ===== ACTIONS =====
  receive(id: number) {
    this.orderService.performAction(id, 'operator_receive');
  }

  startDelivery(id: number) {
    this.orderService.performAction(id, 'operator_start_delivery');
  }

  complete(id: number) {
    this.orderService.performAction(id, 'operator_complete');
  }

  cancel(id: number) {
    this.orderService.performAction(id, 'operator_cancel_delivery');
  }

  confirmReturn(id: number) {
    this.orderService.performAction(id, 'operator_confirm_return');
  }

}
