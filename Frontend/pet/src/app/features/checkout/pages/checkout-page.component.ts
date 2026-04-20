import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {

  cart = inject(CartService);
  checkout = inject(CheckoutService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  selectedItems: any[] = [];

  form = {
    customerName: '',
    phone: '',
    address: '',
    note: ''
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      const productId = Number(params['productId']);

      if (mode === 'single' && productId) {
        // Checkout chỉ 1 sản phẩm
        const item = this.cart.items().find(i => i.productId === productId);
        if (item) {
          this.selectedItems = [item];
        }
      } else {
        // Checkout tất cả giỏ hàng (mặc định)
        this.selectedItems = [...this.cart.items()];
      }
    });
  }

  total = computed(() =>
    this.selectedItems.reduce((sum, item) => sum + item.price, 0)
  );

  placeOrder() {
    if (this.selectedItems.length === 0) {
      alert('Không có sản phẩm nào để thanh toán!');
      return;
    }

    if (!this.form.customerName || !this.form.phone || !this.form.address) {
      alert('Vui lòng nhập đầy đủ thông tin nhận hàng');
      return;
    }

    const order = this.checkout.buildOrder(
      this.form,
      this.selectedItems,
      this.total()
    );

    this.checkout.placeOrder(order);

    // Xóa sản phẩm đã thanh toán khỏi giỏ
    if (this.selectedItems.length === 1) {
      this.cart.removeItem(this.selectedItems[0].productId);
    } else {
      this.cart.clearCart();
    }

    this.router.navigate(['/success'], {
      queryParams: { id: order.id }
    });
  }
}
