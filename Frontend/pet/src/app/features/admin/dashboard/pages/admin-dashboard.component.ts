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
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  imports: [CommonModule, MatCardModule, MatIconModule],
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private adminService = inject(AdminService);

  stats: DashboardStats | null = null;

  @ViewChild('revenueChart') revenueChartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;

  ngOnInit(): void {
    this.adminService.getStats().subscribe((data) => {
      this.stats = data;
    });
  }

  ngAfterViewInit(): void {
    // Dữ liệu mẫu để chart luôn hiển thị đẹp
    setTimeout(() => {
      this.createSampleChart();
    }, 300);
  }

  private createSampleChart() {
    const ctx = this.revenueChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        datasets: [
          {
            label: 'Revenue',
            data: [124500000, 158000000, 132000000, 189000000, 215000000, 248000000],
            borderColor: '#F86D72',
            backgroundColor: 'rgba(248, 109, 114, 0.12)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B' },
          },
          x: {
            grid: { color: '#F1F5F9' },
            ticks: { color: '#64748B' },
          },
        },
      },
    });
  }
}
