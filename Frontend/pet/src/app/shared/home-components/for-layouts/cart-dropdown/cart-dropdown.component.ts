import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart-dropdown',
  imports: [MatIconModule, MatBadgeModule],
  template: `
    <button mat-icon-button (click)="goToCart()">

      <mat-icon
        [matBadge]="total()"
        matBadgeColor="warn"
        matBadgeSize="small"
        matBadgeOverlap="false"
        [matBadgeHidden]="total() === 0"
      >
        shopping_cart
      </mat-icon>

    </button>
  `
})
export class CartDropdownComponent {
  router = inject(Router);
  cart = inject(CartService);

  total = computed(() =>
    this.cart.totalCount() //  dùng luôn từ service (clean hơn)
  );

  goToCart() {
    this.router.navigate(['/cart']);
  }

}
