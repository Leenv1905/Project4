import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  selectedItems: any[] = [];
  isSubmitting = false;

  form = {
    customerName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD'
  };

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const mode = params['mode'];
      const productId = Number(params['productId']);

      if (mode === 'single' && productId) {
        const item = this.cart.items().find((i) => i.productId === productId);
        if (item) {
          this.selectedItems = [item];
        }
      } else {
        this.selectedItems = [...this.cart.items()];
      }
    });
  }

  total = computed(() =>
    this.selectedItems.reduce((sum, item) => sum + item.price, 0)
  );

  placeOrder() {
    if (this.selectedItems.length === 0) {
      this.snackBar.open('Không có sản phẩm nào để thanh toán!', 'Đóng', { duration: 3000 });
      return;
    }

    if (!this.form.customerName || !this.form.phone || !this.form.address) {
      this.snackBar.open('Vui lòng nhập đầy đủ thông tin nhận hàng', 'Đóng', { duration: 5000 });
      return;
    }

    this.isSubmitting = true;

    this.checkout.placeOrder(this.form).subscribe({
      next: (createdOrder) => {
        this.isSubmitting = false;

        if (!createdOrder) {
          this.snackBar.open('Không thể tạo đơn hàng.', 'Đóng', { duration: 5000 });
          return;
        }

        if (this.selectedItems.length === 1) {
          this.cart.removeItem(this.selectedItems[0].productId);
        } else {
          this.cart.clearCart();
        }

        if (this.form.paymentMethod === 'VNPAY') {
          // Assuming we take the first order ID if multiple shops
          // Realistically VNPay should process 1 order or a combined cart order
          // Here we pick the first order's ID for VNPay redirect
          const orderId = Array.isArray(createdOrder) ? createdOrder[0]?.id : createdOrder.id;
          if (orderId) {
            this.checkout.createVNPayUrl(orderId).subscribe({
              next: (res: any) => {
                if (res && res.url) {
                  window.location.href = res.url;
                } else {
                  this.snackBar.open('Lỗi tạo URL thanh toán VNPay', 'Đóng', { duration: 5000 });
                  this.router.navigate(['/success'], { queryParams: { id: orderId } });
                }
              },
              error: () => {
                this.snackBar.open('Lỗi kết nối VNPay', 'Đóng', { duration: 5000 });
                this.router.navigate(['/success'], { queryParams: { id: orderId } });
              }
            });
            return;
          }
        }

        const idToNavigate = Array.isArray(createdOrder) ? createdOrder[0]?.id : createdOrder.id;
        this.router.navigate(['/success'], {
          queryParams: { id: idToNavigate }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        const message =
          err?.error?.message ||
          err?.error ||
          'Đặt hàng thất bại. Vui lòng thử lại.';
        this.snackBar.open(message, 'Đóng', { duration: 5000 });
      }
    });
  }
}
