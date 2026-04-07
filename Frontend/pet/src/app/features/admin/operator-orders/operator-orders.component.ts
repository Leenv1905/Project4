import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';
import { FulfillmentStatus } from '../../../core/models/order.model';
import {OperatorReceiveModalComponent} from './operator-receive-modal/operator-receive-modal.component';

@Component({
  standalone: true,
  selector: 'app-operator-orders',
  imports: [CommonModule],
  templateUrl: './operator-orders.component.html',
  styleUrls: ['./operator-orders.component.scss']
})
export class OperatorOrdersComponent {

  router = inject(Router);
  orderService = inject(OrderService);
  dialog = inject(MatDialog);                    // ← Inject MatDialog

  orders = this.orderService.orders;

  // Status tabs
  statuses: (FulfillmentStatus | 'all')[] = [
    'pending', 'received', 'delivering', 'delivered',
    'return_pending', 'returned', 'all'
  ];

  activeTab = signal<FulfillmentStatus | 'all'>('pending');

  // Phân trang
  page = signal(1);
  pageSize = signal(10);

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();
    return this.orders().filter(o => o.fulfillmentStatus === this.activeTab());
  });

  total = computed(() => this.filteredOrders().length);

  count(status: FulfillmentStatus | 'all'): number {
    if (status === 'all') return this.orders().length;
    return this.orders().filter(o => o.fulfillmentStatus === status).length;
  }

  // === ACTIONS ===
  openReceiveModal(orderId: number) {
    const dialogRef = this.dialog.open(OperatorReceiveModalComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: { orderId: orderId },
      disableClose: true   // Ngăn đóng khi click ngoài (tùy chọn)
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'receive') {
        this.orderService.performAction(result.orderId, 'operator_receive');
      }
      else if (result?.action === 'reject') {
        // Có thể thêm logic từ chối nhận hàng
        console.log('Đã từ chối nhận đơn hàng', result.orderId);
      }
      // action 'save' thì chỉ lưu kiểm tra, không làm gì thêm
    });
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

  goToOrderDetail(id: number) {
    this.router.navigate(['/admin/operators/order', id]);
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

  getFulfillmentClass(status: string): string {
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

  protected readonly Math = Math;
}

// import { Component, signal, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { OrderService } from '../../../core/services/order.service';
// import { FulfillmentStatus } from '../../../core/models/order.model';
// import { ActivatedRoute, Router } from '@angular/router';
//
//
// @Component({
//   standalone: true,
//   selector: 'app-operator-orders',
//   imports: [CommonModule],
//   templateUrl: './operator-orders.component.html',
//   styleUrls: ['./operator-orders.component.scss']
// })
// export class OperatorOrdersComponent {
//
//   route = inject(ActivatedRoute);
//   router = inject(Router);
//   orderService = inject(OrderService);
//   orders = this.orderService.orders;
//
//   // Status tabs cho Operator
//   statuses: (FulfillmentStatus | 'all')[] = [
//     'pending', 'received', 'delivering', 'delivered',
//     'return_pending', 'returned', 'all'
//   ];
//
//   activeTab = signal<FulfillmentStatus | 'all'>('pending');
//
//   // Phân trang
//   page = signal(1);
//   pageSize = signal(10);
//
//   filteredOrders = computed(() => {
//     if (this.activeTab() === 'all') return this.orders();
//     return this.orders().filter(o => o.fulfillmentStatus === this.activeTab());
//   });
//
//   total = computed(() => this.filteredOrders().length);
//
//   count(status: FulfillmentStatus | 'all'): number {
//     if (status === 'all') {
//       return this.orders().length;
//     }
//     return this.orders().filter(o => o.fulfillmentStatus === status).length;
//   }
//
//   // Modal xác minh mã pet khi nhận hàng
//   showVerificationModal = signal(false);
//   selectedOrderIdForReceive = signal<number | null>(null);
//
//   verificationCode = signal('');           // Chỉ 1 ô nhập
//   isCodeValid = signal(false);             // true = mã đúng (PET-A123)
//   isWrongPet = signal(false);              // true = mã sai (PET-B456)
//
//   petInfo = signal<any>(null);
//
//   // Mock dữ liệu
//   private readonly CORRECT_CODE = 'PET-A123';   // Mã đúng
//   private readonly WRONG_CODE   = 'PET-B456';   // Mã sai (pet không khớp)
//
//
//   // === ACTIONS ===
//   openReceiveModal(id: number) {
//     this.selectedOrderIdForReceive.set(id);
//     this.verificationCode.set('');
//     this.isCodeValid.set(false);
//     this.isWrongPet.set(false);
//     this.petInfo.set(null);
//     this.showVerificationModal.set(true);
//   }
//
//   closeVerificationModal() {
//     this.showVerificationModal.set(false);
//     this.selectedOrderIdForReceive.set(null);
//     this.verificationCode.set('');
//   }
//
// // Kiểm tra mã khi người dùng nhập
//   checkVerificationCode() {
//     const code = this.verificationCode().trim().toUpperCase();
//
//     if (code === this.CORRECT_CODE) {
//       this.isCodeValid.set(true);
//       this.isWrongPet.set(false);
//       this.petInfo.set({
//         name: 'Buddy',
//         species: 'Chó',
//         breed: 'Golden Retriever',
//         variety: 'Thuần chủng',
//         vaccination: 'Đã tiêm đầy đủ (Dại, Parvo, Distemper, Leptospirosis) - Lần cuối: 15/01/2025',
//         healthStatus: 'Xuất sắc - Không có bệnh lý, cân nặng 28kg, đã triệt sản',
//         chipId: 'PET-A123'
//       });
//     }
//     else if (code === this.WRONG_CODE) {
//       this.isCodeValid.set(false);
//       this.isWrongPet.set(true);
//       this.petInfo.set({
//         name: 'Max',
//         species: 'Chó',
//         breed: 'Husky Siberia',
//         variety: 'Thuần chủng',
//         vaccination: 'Đã tiêm 4 mũi cơ bản',
//         healthStatus: 'Tốt, đã triệt sản',
//         chipId: 'PET-B456'
//       });
//     }
//     else {
//       this.isCodeValid.set(false);
//       this.isWrongPet.set(false);
//       this.petInfo.set(null);
//     }
//   }
//
//   confirmReceiveFromModal() {
//     if (this.isCodeValid() && this.selectedOrderIdForReceive()) {
//       this.orderService.performAction(this.selectedOrderIdForReceive()!, 'operator_receive');
//       this.closeVerificationModal();
//     }
//   }
//
// // Các action khác
//   startDelivery(id: number) {
//     this.orderService.performAction(id, 'operator_start_delivery');
//   }
//
//   complete(id: number) {
//     this.orderService.performAction(id, 'operator_complete');
//   }
//
//   cancel(id: number) {
//     this.orderService.performAction(id, 'operator_cancel_delivery');
//   }
//
//   confirmReturn(id: number) {
//     this.orderService.performAction(id, 'operator_confirm_return');
//   }
//
//   // Pagination
//   paginatedOrders = computed(() => {
//     const start = (this.page() - 1) * this.pageSize();
//     const end = start + this.pageSize();
//     return this.filteredOrders().slice(start, end);
//   });
//
//   totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));
//
//   nextPage() {
//     if (this.page() < this.totalPages()) this.page.update(p => p + 1);
//   }
//
//   prevPage() {
//     if (this.page() > 1) this.page.update(p => p - 1);
//   }
//
//   changePageSize(size: number) {
//     this.pageSize.set(size);
//     this.page.set(1);
//   }
//   getFulfillmentClass(status: string): string {
//     switch (status) {
//       case 'pending':        return 'pending';
//       case 'received':       return 'received';
//       case 'delivering':     return 'delivering';
//       case 'delivered':      return 'delivered';
//       case 'return_pending': return 'return_pending';
//       case 'returned':       return 'returned';
//       default:               return '';
//     }
//   }
//
//   goToOrderDetail(id: number) {
//     this.router.navigate(['/admin/operators/order', id]);
//   }
//   protected readonly Math = Math;
// }

// import { Component, inject, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {OrderService} from '../../../core/services/order.service';
// import {FulfillmentStatus} from '../../../core/models/order.model';
//
//
// @Component({
//   standalone: true,
//   selector: 'app-operator-orders',
//   imports: [CommonModule],
//   templateUrl: './operator-orders.component.html',
//   styleUrls: ['./operator-orders.component.scss']
// })
// export class OperatorOrdersComponent {
//
//   private orderService = inject(OrderService);
//
//   orders = this.orderService.orders;
//
//   statuses: (FulfillmentStatus | 'all')[] = [
//     'pending',
//     'received',
//     'delivering',
//     'delivered',
//     'return_pending',
//     'returned',
//     'all'
//   ];
//
//   activeTab = signal<FulfillmentStatus | 'all'>('pending');
//
//   filteredOrders = computed(() => {
//
//     if (this.activeTab() === 'all') return this.orders();
//
//     return this.orders().filter(
//       o => o.fulfillmentStatus === this.activeTab()
//     );
//
//   });
//
//   count(status: FulfillmentStatus) {
//     return this.orders().filter(o => o.fulfillmentStatus === status).length;
//   }
//
//   // ===== ACTIONS =====
//   receive(id: number) {
//     this.orderService.performAction(id, 'operator_receive');
//   }
//
//   startDelivery(id: number) {
//     this.orderService.performAction(id, 'operator_start_delivery');
//   }
//
//   complete(id: number) {
//     this.orderService.performAction(id, 'operator_complete');
//   }
//
//   cancel(id: number) {
//     this.orderService.performAction(id, 'operator_cancel_delivery');
//   }
//
//   confirmReturn(id: number) {
//     this.orderService.performAction(id, 'operator_confirm_return');
//   }
//
// }
