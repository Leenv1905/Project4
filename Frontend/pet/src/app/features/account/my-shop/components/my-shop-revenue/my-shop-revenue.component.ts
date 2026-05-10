import { AfterViewInit, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

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
  styleUrls: ['./my-shop-revenue.component.scss'],
})
export class MyShopRevenueComponent implements OnInit, AfterViewInit {
  private readonly orderService = inject(OrderService);

  private revenueChart: Chart | null = null;
  private ordersChart: Chart | null = null;

  // Stats dạng Array để *ngFor hoạt động
  readonly stats = signal<Stat[]>([
    {
      title: 'Total Revenue',
      value: '248,500,000 ₫',
      change: '+18.2%',
      trend: 'up',
      icon: '💰',
    },
    {
      title: 'Total Orders',
      value: '142',
      change: '+12%',
      trend: 'up',
      icon: '📦',
    },
    {
      title: 'This Month Revenue',
      value: '162,000,000 ₫',
      change: '+8.5%',
      trend: 'up',
      icon: '📅',
    },
    {
      title: 'Avg. Order Value',
      value: '1,750,000 ₫',
      change: '+5.4%',
      trend: 'up',
      icon: '⭐',
    },
  ]);

  readonly weeklyRevenue = signal<RevenueBar[]>([
    { day: 'Mon', revenue: 1250000 },
    { day: 'Tue', revenue: 980000 },
    { day: 'Wed', revenue: 2150000 },
    { day: 'Thu', revenue: 1890000 },
    { day: 'Fri', revenue: 2650000 },
    { day: 'Sat', revenue: 1780000 },
    { day: 'Sun', revenue: 3120000 },
  ]);

  readonly topProducts = signal<TopProduct[]>([
    { name: 'Corgi Pembroke', sold: 28, revenue: 89600000 },
    { name: 'Pomeranian Teacup', sold: 19, revenue: 52300000 },
    { name: 'Husky Siberian', sold: 14, revenue: 42000000 },
    { name: 'Golden Retriever', sold: 11, revenue: 38500000 },
  ]);

  ngOnInit() {
    this.orderService.loadShopOrders().subscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createRevenueChart();
      this.createOrdersChart();
    }, 300);
  }

  // ==================== CHARTS ====================
  private createRevenueChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 30', 'Apr 5', 'Apr 10'],
        datasets: [
          {
            label: 'Revenue',
            data: [1250000, 980000, 2150000, 1890000, 2650000, 1780000, 3120000],
            borderColor: '#F86D72',
            backgroundColor: 'rgba(248, 109, 114, 0.12)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }

  private createOrdersChart() {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.ordersChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Orders',
            data: [18, 24, 31, 27],
            backgroundColor: '#F86D72',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  }
}
