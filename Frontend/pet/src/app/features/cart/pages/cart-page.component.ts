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

  addToCartMessage = '';

  addToCartSuccess(item: any) {
    this.addToCartMessage = `Đã thêm "${item.name}" vào giỏ hàng`;
    setTimeout(() => this.addToCartMessage = '', 2500);
  }

  remove(id: number) {
    this.cart.removeItem(id);
  }

  // Thanh toán chỉ sản phẩm này
  // checkoutThisItem(item: any) {
  //   // Logic checkout một sản phẩm (bạn có thể truyền item qua state hoặc query param)
  //   this.router.navigate(['/checkout'], {
  //     state: { selectedItems: [item] }
  //   });
  // }

  checkoutThisItem(item: any) {
    this.router.navigate(['/checkout'], {
      queryParams: {
        productId: item.productId,     // Chỉ truyền ID
        mode: 'single'                 // Để phân biệt checkout 1 hay nhiều
      }
    });
  }

// Nếu muốn giữ nút thanh toán tất cả giỏ hàng
  checkoutAll() {
    this.router.navigate(['/checkout'], {
      queryParams: { mode: 'all' }
    });
  }

  clearCart() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      this.cart.clearCart();
    }
  }
}
