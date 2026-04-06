import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { OrderService } from '../../../../../core/services/order.service';
import { ORDER_STATUS_CONFIG } from '../../../../../core/constants/order-status.constant';
import { getStatusLabel } from '../../../../../core/utils/order-status.util';
import { OrderStatus } from '../../../../../core/models/order.model';
import { VerificationModalComponent } from '../../../../../shared/verification-modal/verification-modal.component';

@Component({
  standalone: true,
  selector: 'app-account-orders',
  imports: [CommonModule, VerificationModalComponent],
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

  // Phân trang
  page = signal(1);
  pageSize = signal(10);

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();
    return this.orders().filter(o => o.status === this.activeTab());
  });

  total = computed(() => this.filteredOrders().length);

  countByStatus(status: OrderStatus) {
    return this.orders().filter(o => o.status === status).length;
  }

  goToDetail(id: number) {
    this.router.navigate(['/order', id]);
  }

  // Pagination
  paginatedOrders = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredOrders().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  nextPage() {
    if (this.page() < this.totalPages()) this.page.update(p => p + 1);
  }

  prevPage() {
    if (this.page() > 1) this.page.update(p => p - 1);
  }

  changePageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1);
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case 'pending':    return 'pending';
      case 'confirmed':  return 'confirmed';
      case 'shipping':   return 'shipping';
      case 'completed':  return 'completed';
      case 'cancelled':  return 'cancelled';
      default:           return '';
    }
  }

  // Modal
  showVerificationModal = signal(false);
  selectedOrderId = signal<number | null>(null);

  openVerificationModal(orderId: number) {
    this.selectedOrderId.set(orderId);
    this.showVerificationModal.set(true);
  }

  onVerificationConfirm(event: { orderId: number; code: string }) {
    this.orderService.performAction(event.orderId, 'user_confirm_received');
    this.showVerificationModal.set(false);
  }

  closeModal() {
    this.showVerificationModal.set(false);
  }

  protected readonly Math = Math;
}

// import { Component, signal, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
//
// import { AccountOrderTimelineComponent } from '../account-order-timeline/account-order-timeline.component';
// import { OrderService } from '../../../../../core/services/order.service';
// import { ORDER_STATUS_CONFIG } from '../../../../../core/constants/order-status.constant';
// import { getStatusLabel } from '../../../../../core/utils/order-status.util';
// import { OrderStatus } from '../../../../../core/models/order.model';
//
// @Component({
//   standalone: true,
//   selector: 'app-account-orders',
//   imports: [CommonModule, AccountOrderTimelineComponent],
//   templateUrl: './account-orders.component.html',
//   styleUrls: ['./account-orders.component.scss']
// })
// export class AccountOrdersComponent {
//
//   orderService = inject(OrderService);
//   router = inject(Router);
//
//   orders = this.orderService.orders;
//
//   statuses = ORDER_STATUS_CONFIG;
//   getStatusLabel = getStatusLabel;
//
//   activeTab = signal<OrderStatus | 'all'>('all');
//
//   filteredOrders = computed(() => {
//     if (this.activeTab() === 'all') return this.orders();
//     return this.orders().filter(o => o.status === this.activeTab());
//   });
//
//   countByStatus(status: OrderStatus) {
//     return this.orders().filter(o => o.status === status).length;
//   }
//   //
//   // cancel(id: number) {
//   //   this.orderService.updateStatus(id, 'cancelled');
//   // }
//
//   confirmReceived(id: number) {
//     this.orderService.performAction(id, 'user_confirm_received');
//   }
//   // Phân tách với delivered của operators
//
//   goToDetail(id: number) {
//     this.router.navigate(['/order', id]);
//   }
//
// }
