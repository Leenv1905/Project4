import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { OrderService } from '../../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-success-page',
  imports: [CommonModule],
  template: `
    <div *ngIf="order() as o">
      <h2>🎉 Đặt hàng thành công!</h2>

      <p>Cảm ơn {{ o.customerName }}</p>

      <p>Mã đơn: #{{ o.id }}</p>

      <p>Tổng tiền: {{ o.totalAmount | number }} ₫</p>
    </div>
  `
})
export class SuccessPageComponent {

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = computed(() => {

    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    return this.orderService.getById(id)();

  });

}
