import { Component, inject, OnInit, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-my-shop-dashboard',
  imports: [CommonModule],
  templateUrl: './my-shop-dashboard.component.html',
  styleUrls: ['./my-shop-dashboard.component.scss'],
})
export class MyShopDashboardComponent implements OnInit, AfterViewInit {
  private revenueChart: Chart | null = null;
  private ordersChart: Chart | null = null;

  readonly stats = signal([
    { title: 'Total Revenue', value: '248,500,000 ₫', change: '+18.2%', trend: 'up', icon: '💰' },
    { title: 'Total Orders', value: '142', change: '+12%', trend: 'up', icon: '📦' },
    { title: 'Active Listings', value: '37', change: '+3', trend: 'up', icon: '🐾' },
    { title: 'Avg. Order Value', value: '1,750,000 ₫', change: '+5.4%', trend: 'up', icon: '📈' },
  ]);

  readonly topProducts = signal([
    { name: 'Corgi Pembroke', sales: 28, revenue: '89,600,000 ₫', trend: 'up' },
    { name: 'Pomeranian Teacup', sales: 19, revenue: '52,300,000 ₫', trend: 'up' },
    { name: 'Husky Siberian', sales: 14, revenue: '42,000,000 ₫', trend: 'stable' },
    { name: 'Golden Retriever', sales: 11, revenue: '38,500,000 ₫', trend: 'up' },
  ]);

  ngOnInit() {
    // Dữ liệu mẫu
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Đợi DOM render xong
      this.createRevenueChart();
      this.createOrdersChart();
    }, 100);
  }

  private createRevenueChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mar 10', 'Mar 15', 'Mar 20', 'Mar 25', 'Mar 30', 'Apr 5', 'Apr 10'],
        datasets: [
          {
            label: 'Revenue (₫)',
            data: [1250000, 980000, 2150000, 1890000, 2650000, 1780000, 3120000],
            borderColor: '#F86D72',
            backgroundColor: 'rgba(248, 109, 114, 0.1)',
            tension: 0.4,
            borderWidth: 3,
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
