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

  private cart = inject(CartService);
  private checkout = inject(CheckoutService);
  private router = inject(Router);

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

    const order = this.checkout.buildOrder(
      this.form,
      this.items(),
      this.total()
    );

    this.checkout.placeOrder(order);

    this.cart.clearCart();

    this.router.navigate(['/success'], {
      queryParams: { id: order.id }
    });

  }

}
