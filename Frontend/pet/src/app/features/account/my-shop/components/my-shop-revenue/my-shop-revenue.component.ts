import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';

interface RevenueBar {
  day: string;
  revenue: number;
}

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

@Component({
  standalone: true,
  selector: 'app-my-shop-revenue',
  imports: [CommonModule],
  templateUrl: './my-shop-revenue.component.html',
  styleUrls: ['./my-shop-revenue.component.scss']
})
export class MyShopRevenueComponent implements OnInit {
  private readonly orderService = inject(OrderService);

  readonly weeklyRevenue = signal<RevenueBar[]>([
    { day: 'T2', revenue: 0 },
    { day: 'T3', revenue: 0 },
    { day: 'T4', revenue: 0 },
    { day: 'T5', revenue: 0 },
    { day: 'T6', revenue: 0 },
    { day: 'T7', revenue: 0 },
    { day: 'CN', revenue: 0 }
  ]);

  readonly topProducts = signal<TopProduct[]>([]);

  readonly stats = computed(() => {
    const orders = this.orderService.orders();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const thisMonthOrders = orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    });
    const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      thisMonthRevenue,
      thisMonthOrders: thisMonthOrders.length,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
    };
  });

  readonly totalRevenue = computed(() => this.stats().totalRevenue);
  readonly totalOrders = computed(() => this.stats().totalOrders);

  ngOnInit() {
    this.orderService.loadShopOrders().subscribe({
      next: () => {
        this.buildWeeklyRevenue();
        this.buildTopProducts();
      }
    });
  }

  private buildWeeklyRevenue() {
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const revenueByDay = new Map<string, number>();

    this.orderService.orders().forEach((order) => {
      const date = new Date(order.createdAt);
      const label = dayLabels[date.getDay()];
      revenueByDay.set(label, (revenueByDay.get(label) || 0) + order.totalAmount);
    });

    this.weeklyRevenue.set([
      { day: 'T2', revenue: revenueByDay.get('T2') || 0 },
      { day: 'T3', revenue: revenueByDay.get('T3') || 0 },
      { day: 'T4', revenue: revenueByDay.get('T4') || 0 },
      { day: 'T5', revenue: revenueByDay.get('T5') || 0 },
      { day: 'T6', revenue: revenueByDay.get('T6') || 0 },
      { day: 'T7', revenue: revenueByDay.get('T7') || 0 },
      { day: 'CN', revenue: revenueByDay.get('CN') || 0 }
    ]);
  }

  private buildTopProducts() {
    const aggregated = new Map<string, TopProduct>();

    this.orderService.orders().forEach((order) => {
      order.items.forEach((item) => {
        const current = aggregated.get(item.name) || {
          name: item.name,
          sold: 0,
          revenue: 0
        };
        current.sold += item.quantity;
        current.revenue += item.price * item.quantity;
        aggregated.set(item.name, current);
      });
    });

    this.topProducts.set(
      Array.from(aggregated.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
    );
  }
}
