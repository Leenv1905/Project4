import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../services/checkout.service';

@Component({
  standalone: true,
  selector: 'app-success-page',
  imports: [CommonModule],
  template: `
    <div class="success">
      <h1>🎉 Đặt hàng thành công!</h1>
      <p *ngIf="order()">Cảm ơn {{ order()?.customerName }}</p>
    </div>
  `
})
export class SuccessPageComponent {

  checkout = inject(CheckoutService);

  order = this.checkout.currentOrder;

}
