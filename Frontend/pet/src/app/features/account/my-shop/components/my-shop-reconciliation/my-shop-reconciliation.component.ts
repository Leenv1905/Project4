import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReconciliationItem {
  orderId: number;
  customerName: string;
  orderAmount: number;
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
export class MyShopReconciliationComponent {
  reconciliationData = signal<ReconciliationItem[]>([
    {
      orderId: 10023,
      customerName: 'Nguyễn Thị Lan',
      orderAmount: 12500000,
      billAmount: 11250000,
      status: 'received',
      date: '15/04/2026',
    },
    {
      orderId: 10019,
      customerName: 'Trần Văn Minh',
      orderAmount: 8500000,
      billAmount: 7650000,
      status: 'received',
      date: '14/04/2026',
    },
    {
      orderId: 10015,
      customerName: 'Lê Thị Hoa',
      orderAmount: 15800000,
      billAmount: 14220000,
      status: 'received',
      date: '13/04/2026',
    },
    {
      orderId: 10012,
      customerName: 'Phạm Minh Quân',
      orderAmount: 9200000,
      billAmount: 8280000,
      status: 'pending',
      date: '12/04/2026',
    },
  ]);

  stats = computed(() => {
    const data = this.reconciliationData();

    const totalAllBills = data.reduce((sum, item) => sum + item.billAmount, 0); // Tổng tất cả billAmount
    const totalReceived = data
      .filter((item) => item.status === 'received')
      .reduce((sum, item) => sum + item.billAmount, 0); // Chỉ các đơn đã nhận

    const notReceived = data
      .filter((item) => item.status === 'pending')
      .reduce((sum, item) => sum + item.billAmount, 0); // Chỉ các đơn chưa nhận

    return {
      totalOrder: totalAllBills, // Total Order Revenue = Tổng của cả received + pending
      totalReceived: totalReceived, // Total Received (Bills) = Chỉ các đơn đã nhận
      difference: notReceived, // Difference = Giá trị các đơn Not Received
      matchedCount: data.filter((item) => item.status === 'received').length,
      totalItems: data.length,
    };
  });
}
