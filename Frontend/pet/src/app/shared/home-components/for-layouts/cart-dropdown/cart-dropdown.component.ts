import { Component, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart-dropdown',
  imports: [MatIconModule, MatBadgeModule],
  template: `
    <button mat-icon-button>
      <mat-icon matBadge="{{ total() }}" matBadgeColor="primary">
        shopping_cart
      </mat-icon>
    </button>
  `
})
export class CartDropdownComponent {
  total = computed(() =>
    this.cart.items().reduce((t, i) => t + i.quantity, 0)
  );

  constructor(private cart: CartService) {}
}
