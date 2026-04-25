import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-success-page',
  imports: [CommonModule],
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  private orderId = 0;
  isLoading = false;

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.queryParamMap.get('id')) || 0;
    this.isLoading = true;
    this.orderService.loadMyOrders().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  order = computed(() => {
    if (!this.orderId) return null;
    return this.orderService.getById(this.orderId)();
  });

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
  }
}
