// dashboard.page.ts
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  template: `
    <h2>Dashboard</h2>

    <div class="grid">
      <mat-card>Total Books: 120</mat-card>
      <mat-card>Total Authors: 25</mat-card>
      <mat-card>Active Users: 340</mat-card>
    </div>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
  `],
  imports: [MatCardModule]
})
export class DashboardPage {}
