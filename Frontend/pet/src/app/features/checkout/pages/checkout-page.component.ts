import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent {

  cart = inject(CartService);
  checkout = inject(CheckoutService);
  router = inject(Router);

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
      items: this.items(),
      totalAmount: this.total(),
      ...this.form
    };

    this.checkout.placeOrder(order);

    this.cart.clearCart();

    this.router.navigate(['/success']);
  }

}
