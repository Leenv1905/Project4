import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../../core/services/order.service';
import { VerificationModalComponent } from '../../../../shared/verification-modal/verification-modal.component';

@Component({
  standalone: true,
  selector: 'app-operator-order-detail',
  imports: [CommonModule, VerificationModalComponent],
  templateUrl: './operator-order-detail.component.html',
  styleUrls: ['./operator-order-detail.component.scss']
})
export class OperatorOrderDetailComponent {

  orderService = inject(OrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  orders = this.orderService.orders;
  orderId = signal<number | null>(null);

  showVerificationModal = signal(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId.set(Number(params['id']));
    });
  }

  order = computed(() => {
    const id = this.orderId();
    if (!id) return null;
    return this.orders().find(o => o.id === id) || null;
  });

  // Hành động của Operator
  receiveOrder() {
    const id = this.orderId();
    if (id) this.openVerificationModal();   // Yêu cầu xác minh mã pet
  }

  startDelivery() {
    const id = this.orderId();
    if (id) this.orderService.performAction(id, 'operator_start_delivery');
  }

  completeDelivery() {
    const id = this.orderId();
    if (id) this.orderService.performAction(id, 'operator_complete');
  }

  cancelDelivery() {
    const id = this.orderId();
    if (id) this.orderService.performAction(id, 'operator_cancel_delivery');
  }

  confirmReturn() {
    const id = this.orderId();
    if (id) this.orderService.performAction(id, 'operator_confirm_return');
  }

  openVerificationModal() {
    this.showVerificationModal.set(true);
  }

  onVerificationConfirm(event: { orderId: number; code: string }) {
    this.orderService.performAction(event.orderId, 'operator_receive');
    this.showVerificationModal.set(false);
  }

  closeModal() {
    this.showVerificationModal.set(false);
  }

  back() {
    this.router.navigate(['/admin/operators']);   // Quay về danh sách Operator
  }
  // Helper để hiển thị màu trạng thái
  getFulfillmentClass(status: string | undefined): string {
    if (!status) return '';

    switch (status) {
      case 'pending':        return 'pending';
      case 'received':       return 'received';
      case 'delivering':     return 'delivering';
      case 'delivered':      return 'delivered';
      case 'return_pending': return 'return_pending';
      case 'returned':       return 'returned';
      default:               return '';
    }
  }
}
