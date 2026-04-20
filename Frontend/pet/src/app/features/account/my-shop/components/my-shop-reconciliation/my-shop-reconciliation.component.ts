import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReconciliationItem {
  orderId: number;
  customerName: string;
  orderAmount: number;
  billAmount: number | null;
  status: 'matched' | 'mismatched' | 'pending';
  date: string;
}

@Component({
  standalone: true,
  selector: 'app-my-shop-reconciliation',
  imports: [CommonModule],
  templateUrl: './my-shop-reconciliation.component.html',
  styleUrls: ['./my-shop-reconciliation.component.scss']
})
export class MyShopReconciliationComponent {

  // Dữ liệu giả lập (đơn hàng đã giao thành công + bill chuyển tiền)
  reconciliationData = signal<ReconciliationItem[]>([
    {
      orderId: 10023,
      customerName: 'Nguyễn Thị Lan',
      orderAmount: 12500000,
      billAmount: 12500000,
      status: 'matched',
      date: '15/04/2026'
    },
    {
      orderId: 10019,
      customerName: 'Trần Văn Minh',
      orderAmount: 8500000,
      billAmount: 8500000,
      status: 'matched',
      date: '14/04/2026'
    },
    {
      orderId: 10015,
      customerName: 'Lê Thị Hoa',
      orderAmount: 15800000,
      billAmount: 15000000,
      status: 'mismatched',
      date: '13/04/2026'
    },
    {
      orderId: 10012,
      customerName: 'Phạm Minh Quân',
      orderAmount: 9200000,
      billAmount: null,
      status: 'pending',
      date: '12/04/2026'
    }
  ]);

  // Thống kê tổng quan
  stats = computed(() => {
    const data = this.reconciliationData();
    const totalOrder = data.reduce((sum, item) => sum + item.orderAmount, 0);
    const totalBill = data.reduce((sum, item) => sum + (item.billAmount || 0), 0);
    const matched = data.filter(item => item.status === 'matched').length;

    return {
      totalOrder,
      totalBill,
      difference: totalOrder - totalBill,
      matchedCount: matched,
      totalItems: data.length
    };
  });
}
