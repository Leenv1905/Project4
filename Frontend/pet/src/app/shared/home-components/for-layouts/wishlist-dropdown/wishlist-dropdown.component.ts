import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WishlistService } from '../../../../core/services/wishlist.service';

@Component({
  standalone: true,
  selector: 'app-wishlist-dropdown',
  imports: [MatMenuModule, MatButtonModule, CommonModule],
  templateUrl: './wishlist-dropdown.component.html'
})
export class WishlistDropdownComponent {
  constructor(public wishlist: WishlistService) {}
}
