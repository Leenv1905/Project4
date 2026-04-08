// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
//
// import { Product } from '../../../../core/models/product.model';
// import { CartService } from '../../../../core/services/cart.service';
//
// @Component({
//   standalone: true,
//   selector: 'app-product-card',
//   imports: [
//     CommonModule,
//     MatIconModule,
//     MatButtonModule
//   ],
//   templateUrl: './product-card.component.html',
//   styleUrls: ['./product-card.component.scss']
// })
// export class ProductCardComponent {
//
//   @Input({ required: true }) product!: Product;
//
//   constructor(
//     private router: Router,
//     private cart: CartService
//   ) {}
//
//   navigateToDetail() {
//     this.router.navigate(['/productdetail', this.product.id]);
//   }
//
//   addToCart() {
//     if (this.product.status !== 'available') return;
//
//     this.cart.addToCart({
//       productId: this.product.id,
//       name: this.product.name,
//       price: this.product.price,
//       quantity: 1,
//       image: this.product.images[0] || '',
//       shopName: this.product.shopName
//     });
//   }
//
//   getStatusColor(status: string): string {
//     switch (status) {
//       case 'available': return '#15803d';
//       case 'sold': return '#b91c1c';
//       case 'reserved': return '#d97706';
//       default: return '#6b7280';
//     }
//   }
//
//   getStatusLabel(status: string): string {
//     switch (status) {
//       case 'available': return 'Còn hàng';
//       case 'sold': return 'Đã bán';
//       case 'reserved': return 'Đã đặt';
//       case 'not_for_sale': return 'Không bán';
//       default: return status;
//     }
//   }
// }

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {

  @Input({ required: true }) product!: Product;

  constructor(
    private router: Router,
    private cart: CartService
  ) {}

  navigateDetail() {
    this.router.navigate(['/productdetail', this.product.id]);
  }

  addToCart() {
    this.cart.addToCart({
      productId: this.product.id,
      name: this.product.name,
      price: this.product.price,
      quantity: 1,
      image: this.product.images[0],
      shopName: this.product.shopName
    });
  }

  stars(): number[] {
    return Array(5).fill(0); // mock rating sau này
  }
}
