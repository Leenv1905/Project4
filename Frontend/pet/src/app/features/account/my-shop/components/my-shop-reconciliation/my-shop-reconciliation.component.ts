import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';

interface DeliveredOrderItem {
  orderId: number;
  orderCode: string;
  customerName: string;
  deliveredAt: string;
  orderAmount: number;
  fee: number;
  netAmount: number;
}

interface ReconciliationData {
  totalListedAmount: number;
  totalPets: number;
  soldCount: number;
  unsoldCount: number;
  grossRevenue: number;
  platformFee: number;
  netRevenue: number;
  deliveredOrders: DeliveredOrderItem[];
  billAmount: number;
  status: 'received' | 'pending';
  date: string;
}

@Component({
  standalone: true,
  selector: 'app-my-shop-reconciliation',
  imports: [CommonModule],
  templateUrl: './my-shop-reconciliation.component.html',
  styleUrls: ['./my-shop-reconciliation.component.scss'],
})
export class MyShopReconciliationComponent implements OnInit {
  private orderService = inject(OrderService);

  isLoading = signal(true);
  data = signal<ReconciliationData | null>(null);
  error = signal('');

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.error.set('');
    this.orderService.getShopReconciliation().subscribe({
      next: (res) => {
        this.data.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Không thể tải dữ liệu. Vui lòng thử lại.');
        this.isLoading.set(false);
      }
    });
  }
}
