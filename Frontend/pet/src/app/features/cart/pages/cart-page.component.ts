import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {

  cart = inject(CartService);
  router = inject(Router);

  items = this.cart.items;
  total = this.cart.total;

  increase(item: any) {
    this.cart.updateQuantity(item.productId, item.quantity + 1);
  }

  decrease(item: any) {
    this.cart.updateQuantity(item.productId, item.quantity - 1);
  }

  remove(id: number) {
    this.cart.removeItem(id);
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

}
