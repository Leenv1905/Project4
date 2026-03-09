import { Component } from '@angular/core';
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
  constructor(public auth: AuthService) {}
}
