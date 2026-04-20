import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router } from '@angular/router';

import { CartService } from '../../../../core/services/cart.service';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: 'app-cart-dropdown',
  imports: [MatIconModule, MatBadgeModule, MatTooltip],
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.scss']
})
export class CartDropdownComponent {

  router = inject(Router);
  cart = inject(CartService);

  // Vì giỏ chỉ chứa tối đa 1 pet, ta dùng itemCount thay vì totalCount
  itemCount = computed(() => this.cart.items().length);

  hasItem = computed(() => this.itemCount() > 0);

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
