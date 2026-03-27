import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AccountOrderTimelineComponent } from '../../components/account-order-timeline/account-order-timeline.component';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule, AccountOrderTimelineComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);

  // computed trực tiếp từ route + service
  order = computed(() => {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    const result = this.orderService.getById(id)();

    // nếu không tìm thấy order → redirect
    if (!result) {
      this.router.navigate(['/account'], {
        queryParams: { tab: 'orders' }
      });
    }

    return result;
  });

}
