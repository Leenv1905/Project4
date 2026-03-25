import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';
import { WishlistDropdownComponent } from '../wishlist-dropdown/wishlist-dropdown.component';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  standalone: true,
  selector: 'app-user-items',
  imports: [
    MatIconModule,
    CommonModule,
    MatMenuModule,
    CartDropdownComponent,
    WishlistDropdownComponent,
    UserModalComponent
  ],
  templateUrl: './user-items.component.html'
})
export class UserItemsComponent {

  auth = inject(AuthService);
  router = inject(Router);

  goToAccount() {
    this.router.navigate(['/account'], {
      queryParams: { tab: 'orders' }
    });
  }

  goToShop() {
    this.router.navigate(['/my-shop'], {
      queryParams: { tab: 'dashboard' }
    });
  }

}
