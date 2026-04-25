import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminService, DashboardStats } from '../../../../core/services/admin.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Quản Trị Hệ Thống</h1>
        <p>Chào mừng trở lại, Admin! Dưới đây là thống kê hoạt động hôm nay.</p>
      </header>

      <div class="stats-grid" *ngIf="stats">
        <mat-card class="stat-card revenue">
          <div class="card-content">
            <div class="icon-bg">
              <mat-icon>payments</mat-icon>
            </div>
            <div class="data">
              <span class="label">Tổng Doanh Thu</span>
              <h3 class="value">{{ stats.totalRevenue | currency:'VND':'symbol':'1.0-0' }}</h3>
              <span class="trend up"><mat-icon>trending_up</mat-icon> +12% so với tháng trước</span>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card users">
          <div class="card-content">
            <div class="icon-bg">
              <mat-icon>people</mat-icon>
            </div>
            <div class="data">
              <span class="label">Người Dùng</span>
              <h3 class="value">{{ stats.totalUsers }}</h3>
              <span class="trend"><mat-icon>person_add</mat-icon> Hoạt động tích cực</span>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card pets">
          <div class="card-content">
            <div class="icon-bg">
              <mat-icon>pets</mat-icon>
            </div>
            <div class="data">
              <span class="label">Thú Cưng Đăng Bán</span>
              <h3 class="value">{{ stats.totalPets }}</h3>
              <span class="trend">Sẵn sàng giao dịch</span>
            </div>
          </div>
        </mat-card>

        <mat-card class="stat-card orders">
          <div class="card-content">
            <div class="icon-bg">
              <mat-icon>shopping_bag</mat-icon>
            </div>
            <div class="data">
              <span class="label">Đơn Hàng</span>
              <h3 class="value">{{ stats.totalOrders }}</h3>
              <span class="trend">Trong tháng này</span>
            </div>
          </div>
        </mat-card>
      </div>

      <div class="charts-section">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Phân Tích Doanh Thu</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-wrapper">
              <canvas #revenueChart></canvas>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, MatCardModule, MatIconModule]
})
export class DashboardPage implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);
  
  stats: DashboardStats | null = null;
  
  @ViewChild('revenueChart') revenueChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  ngOnInit(): void {
    this.adminService.getStats().subscribe(data => {
      this.stats = data;
    });
  }

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  loadChartData() {
    this.adminService.getRevenueChart().subscribe(data => {
      const labels = data.map(d => d.month);
      const values = data.map(d => d.revenue);

      this.createChart(labels, values);
    });
  }

  createChart(labels: string[], data: number[]) {
    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Doanh thu (VND)',
          data: data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6366f1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}
