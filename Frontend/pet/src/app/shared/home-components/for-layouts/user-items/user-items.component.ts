import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../../core/services/auth.service';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';
import { WishlistDropdownComponent } from '../wishlist-dropdown/wishlist-dropdown.component';
// import { WishlistDropdownComponent } from '../wishlist-dropdown/wishlist-dropdown.component';
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
    // WishlistDropdownComponent,
    UserModalComponent,
    MatSnackBarModule
  ],
  templateUrl: './user-items.component.html',
  styleUrls: ['./user-items.component.scss']
})
export class UserItemsComponent {

  auth = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  // Computed để kiểm tra role
  isAuthenticated = this.auth.isAuthenticated;

  isAdminOrOperator = this.auth.isStaff;
  isShop = this.auth.isShop;
  isUserOrShop = computed(() => this.auth.isUser() || this.auth.isShop());

  // Kiểm tra có nên hiển thị Cart & Wishlist không
  showCartAndWishlist = computed(() => this.isUserOrShop());

  goToAccount() {
    this.router.navigate(['/account'], { queryParams: { tab: 'orders' } });
  }

  goToShop() {
    this.router.navigate(['/my-shop'], { queryParams: { tab: 'dashboard' } });
  }

  goToAdmin() {
    if (this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/operator/tasks/verify']);
    }
  }

  login() {
    this.auth.openLogin();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.snackBar.open('Đã đăng xuất thành công', 'Đóng', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Lỗi khi đăng xuất', 'Đóng', { duration: 5000 });
      }
    });
  }
}
