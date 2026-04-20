import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-my-shop-revenue',
  imports: [CommonModule],
  templateUrl: './my-shop-revenue.component.html',
  styleUrls: ['./my-shop-revenue.component.scss']
})
export class MyShopRevenueComponent {

  // Dữ liệu giả lập (sau này sẽ lấy từ API)
  stats = signal({
    totalRevenue: 124850000,      // Tổng doanh thu
    totalOrders: 87,              // Tổng đơn hàng
    thisMonthRevenue: 28500000,   // Doanh thu tháng này
    thisMonthOrders: 24,          // Đơn hàng tháng này
    averageOrderValue: 1435000    // Giá trị đơn trung bình
  });

  // Dữ liệu doanh thu theo tuần (giả lập)
  weeklyRevenue = signal([
    { day: 'T2', revenue: 4200000 },
    { day: 'T3', revenue: 6800000 },
    { day: 'T4', revenue: 5300000 },
    { day: 'T5', revenue: 9100000 },
    { day: 'T6', revenue: 12400000 },
    { day: 'T7', revenue: 7800000 },
    { day: 'CN', revenue: 6500000 }
  ]);

  // Top sản phẩm bán chạy
  topProducts = signal([
    { name: 'Chó Poodle Mini Trắng', sold: 12, revenue: 102000000 },
    { name: 'Chó Corgi Pembroke', sold: 9, revenue: 67500000 },
    { name: 'Mèo Anh Lông Ngắn', sold: 7, revenue: 31500000 }
  ]);

  totalRevenue = computed(() => this.stats().totalRevenue);
  totalOrders = computed(() => this.stats().totalOrders);
}
