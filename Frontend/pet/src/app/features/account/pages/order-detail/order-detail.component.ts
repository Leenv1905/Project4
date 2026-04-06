import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../../core/services/order.service';
import { getStatusLabel } from '../../../../core/utils/order-status.util';
import { OrderStatus } from '../../../../core/models/order.model';
import {VerificationModalComponent} from '../../../../shared/verification-modal/verification-modal.component';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule, VerificationModalComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {

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

  getStatusLabel = getStatusLabel;

  backToOrders() {
    this.router.navigate(['/account'], {
      queryParams: { tab: 'orders' }
    });
  }
  openVerificationModal() {
    const id = this.orderId();
    if (id) {
      this.showVerificationModal.set(true);
    }
  }
  onVerificationConfirm(event: { orderId: number; code: string }) {
    this.orderService.performAction(event.orderId, 'user_confirm_received');
    this.showVerificationModal.set(false);
  }

  closeModal() {
    this.showVerificationModal.set(false);
  }

  // Helper cho class status
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

  // ================== SAU NÀY SỬ DỤNG ==================
  // onScanQR() { ... }   // kết nối camera / QR scanner
  // onConnectNFT() { ... } // kết nối wallet NFT
}


// import { Component, inject, computed } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
//
// import { AccountOrderTimelineComponent } from '../../my-account/components/account-order-timeline/account-order-timeline.component';
// import { OrderService } from '../../../../core/services/order.service';
//
// @Component({
//   standalone: true,
//   selector: 'app-order-detail',
//   imports: [CommonModule, AccountOrderTimelineComponent],
//   templateUrl: './order-detail.component.html',
//   styleUrls: ['./order-detail.component.scss']
// })
// export class OrderDetailComponent {
//
//   route = inject(ActivatedRoute);
//   router = inject(Router);
//   orderService = inject(OrderService);
//
//   // computed trực tiếp từ route + service
//   order = computed(() => {
//
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//
//     const result = this.orderService.getById(id)();
//
//     // nếu không tìm thấy order → redirect
//     if (!result) {
//       this.router.navigate(['/account'], {
//         queryParams: { tab: 'orders' }
//       });
//     }
//
//     return result;
//   });
//
// }
