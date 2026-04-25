import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-payment-result',
  imports: [CommonModule],
  template: `
    <div class="payment-result-container" style="text-align: center; padding: 50px;">
      <h2 *ngIf="isSuccess" style="color: green;">Thanh toán thành công!</h2>
      <h2 *ngIf="!isSuccess && !isLoading" style="color: red;">Thanh toán thất bại!</h2>
      <h2 *ngIf="isLoading" style="color: blue;">Đang xử lý...</h2>
      
      <p *ngIf="orderId">Mã đơn hàng: {{ orderId }}</p>
      
      <button (click)="goToHome()" style="margin-top: 20px; padding: 10px 20px; cursor: pointer;">
        Về trang chủ
      </button>
      <button (click)="goToOrders()" style="margin-top: 20px; margin-left: 10px; padding: 10px 20px; cursor: pointer;">
        Xem đơn hàng
      </button>
    </div>
  `
})
export class PaymentResultComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);

  isSuccess = false;
  isLoading = true;
  orderId: string | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.isLoading = false;
      const responseCode = params['vnp_ResponseCode'];
      this.orderId = params['vnp_TxnRef'];

      if (responseCode === '00') {
        this.isSuccess = true;
      } else {
        this.isSuccess = false;
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/account/my-account/orders']);
  }
}
