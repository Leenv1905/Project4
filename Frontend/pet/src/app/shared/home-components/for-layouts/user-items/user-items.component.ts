import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../../../core/services/auth.service';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';
import { WishlistDropdownComponent } from '../wishlist-dropdown/wishlist-dropdown.component';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  standalone: true,
  selector: 'app-user-items',
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    CartDropdownComponent,
    WishlistDropdownComponent,
    UserModalComponent
  ],
  templateUrl: './user-items.component.html',
  styleUrls: ['./user-items.component.scss']
})
export class UserItemsComponent {

  auth = inject(AuthService);
  router = inject(Router);

  // Computed để kiểm tra role
  isAuthenticated = this.auth.isAuthenticated;
  userRole = this.auth.role;

  // Kiểm tra có nên hiển thị Cart & Wishlist không
  showCartAndWishlist = computed(() => {
    const role = this.userRole();
    return role === 'user' || role === 'shop';
  });

  goToAccount() {
    this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
  }

  goToShop() {
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'dashboard' } });
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  login() {
    this.auth.openLogin();
  }
}
