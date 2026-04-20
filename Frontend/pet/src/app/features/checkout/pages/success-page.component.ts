import { Component, inject, computed } from '@angular/core';
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
export class SuccessPageComponent {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = computed(() => {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));
    if (!id) return null;

    return this.orderService.getById(id)();
  });

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
  }
}
