import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-admin-placeholder',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="placeholder-container">
      <mat-icon class="placeholder-icon">{{ icon || 'construction' }}</mat-icon>
      <h1>{{ title }}</h1>
      <p>Tính năng này đang được phát triển. Vui lòng quay lại sau!</p>
      <div class="status-badge">Sắp ra mắt</div>
    </div>
  `,
  styles: [`
    .placeholder-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      margin: 20px;
    }
    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #0ea5e9;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 28px;
      color: #1e293b;
      margin-bottom: 12px;
    }
    p {
      color: #64748b;
      font-size: 16px;
      margin-bottom: 24px;
    }
    .status-badge {
      background: #e0f2fe;
      color: #0369a1;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 14px;
    }
  `]
})
export class AdminPlaceholderComponent {
  @Input() title: string = 'Đang phát triển';
  @Input() icon: string = 'construction';
}
