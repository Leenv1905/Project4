import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';
// CÓ THỂ NGHIÊN CỨU BỎ CHECKOUT SERVICE
import { OrderService } from '../../../core/services/order.service';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent {

  cart = inject(CartService);
  // <*/ checkout = inject(CheckoutService); /*>
  router = inject(Router);
  orderService = inject(OrderService);

  items = this.cart.items;

  form = {
    customerName: '',
    phone: '',
    address: '',
    note: ''
  };

  total = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  placeOrder() {

    const order = {
      id: Date.now(), // mock id
      items: this.items(),
      totalAmount: this.total(),
      status: 'pending' as const, // Trạng thái ban đầu khi mới khởi ta đơn hàng
      // status: 'pending' as OrderStatus,
      createdAt: new Date(),

      customerName: this.form.customerName,
      phone: this.form.phone,
      address: this.form.address,
      note: this.form.note
    };

    this.orderService.createOrder(order);

    this.cart.clearCart();

    this.router.navigate(['/success']);
  }

}
