import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { UserProfileService, UserAddress, CreateAddressPayload } from '../../../core/services/user-profile.service';

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
  profileService = inject(UserProfileService);

  selectedItems: any[] = [];
  isSubmitting = false;

  // Sản phẩm từ "Mua ngay" — chưa có trong giỏ hàng, cần thêm trước khi đặt
  private buyNowItem: any = null;

  // Địa chỉ đã lưu
  addresses: UserAddress[] = [];
  selectedAddressId: number | null = null;
  isLoadingAddresses = false;

  // Form thêm địa chỉ mới
  showNewAddressForm = false;
  isSavingAddress = false;
  newAddress: CreateAddressPayload = { receiverName: '', phone: '', address: '', isDefault: false };

  form = {
    customerName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD'
  };

  ngOnInit() {
    const state = history.state as { buyNowItem?: any };

    this.route.queryParams.subscribe((params) => {
      const mode = params['mode'];
      const productId = Number(params['productId']);

      if (mode === 'single' && productId) {
        if (state?.buyNowItem) {
          // Đến từ "Mua ngay" — sản phẩm chưa trong giỏ
          this.buyNowItem = state.buyNowItem;
          this.selectedItems = [state.buyNowItem];
        } else {
          // Đến từ giỏ hàng — item đã có trong cart signal
          const item = this.cart.items().find((i) => i.productId === productId);
          if (item) {
            this.selectedItems = [item];
          } else {
            // Cart signal chưa kịp load — subscribe để đợi
            this.cart.loadCart().subscribe(() => {
              const found = this.cart.items().find((i) => i.productId === productId);
              if (found) this.selectedItems = [found];
            });
          }
        }
      } else {
        if (this.cart.items().length > 0) {
          this.selectedItems = [...this.cart.items()];
        } else {
          this.cart.loadCart().subscribe(() => {
            this.selectedItems = [...this.cart.items()];
          });
        }
      }
    });

    this.loadAddresses();
  }

  loadAddresses() {
    this.isLoadingAddresses = true;
    this.profileService.getMyAddresses().subscribe({
      next: (list) => {
        this.isLoadingAddresses = false;
        this.addresses = list || [];
        const def = (list || []).find(a => a.isDefault) || (list || [])[0];
        if (def) {
          this.selectAddress(def);
        } else {
          this.profileService.getMyProfile().subscribe({
            next: (profile) => {
              if (profile?.address) {
                this.form.customerName = profile.name || '';
                this.form.phone = profile.phone || '';
                this.form.address = profile.address;
              }
            }
          });
        }
      },
      error: () => { this.isLoadingAddresses = false; }
    });
  }

  trackAddress(_index: number, addr: UserAddress) { return addr.id; }

  selectAddress(addr: UserAddress) {
    this.selectedAddressId = addr.id;
    this.form.customerName = addr.receiverName;
    this.form.phone = addr.phone;
    this.form.address = addr.address;
    this.showNewAddressForm = false;
  }

  toggleNewAddressForm() {
    this.showNewAddressForm = !this.showNewAddressForm;
    if (this.showNewAddressForm) {
      this.selectedAddressId = null;
      this.newAddress = { receiverName: '', phone: '', address: '', isDefault: false };
    }
  }

  saveNewAddress() {
    if (!this.newAddress.receiverName || !this.newAddress.phone || !this.newAddress.address) {
      this.snackBar.open('Vui lòng nhập đầy đủ thông tin địa chỉ', 'Đóng', { duration: 3000 });
      return;
    }
    this.isSavingAddress = true;
    this.profileService.createAddress(this.newAddress).subscribe({
      next: (saved) => {
        this.isSavingAddress = false;
        this.addresses = this.newAddress.isDefault
          ? [...this.addresses.map(a => ({ ...a, isDefault: false })), saved]
          : [...this.addresses, saved];
        this.profileService.invalidateAddressCache();
        this.selectAddress(saved);
        this.showNewAddressForm = false;
        this.snackBar.open('Đã lưu địa chỉ mới', 'Đóng', { duration: 2000 });
      },
      error: () => {
        this.isSavingAddress = false;
        this.snackBar.open('Không thể lưu địa chỉ', 'Đóng', { duration: 3000 });
      }
    });
  }

  total = computed(() =>
    this.selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
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

    if (this.buyNowItem) {
      // "Mua ngay" — thêm vào giỏ trước rồi mới checkout
      this.cart.addToCart(this.buyNowItem).subscribe({
        next: () => this.doPlaceOrder(),
        error: () => {
          this.isSubmitting = false;
          this.snackBar.open('Không thể thêm sản phẩm vào giỏ hàng', 'Đóng', { duration: 3000 });
        }
      });
    } else {
      this.doPlaceOrder();
    }
  }

  private doPlaceOrder() {
    const payload = {
      ...this.form,
      addressId: this.selectedAddressId ?? undefined
    };

    this.checkout.placeOrder(payload).subscribe({
      next: (createdOrder) => {
        this.isSubmitting = false;

        if (!createdOrder) {
          this.snackBar.open('Không thể tạo đơn hàng.', 'Đóng', { duration: 5000 });
          return;
        }

        // Xoá khỏi giỏ hàng FE
        if (this.buyNowItem) {
          this.cart.clearCart();
        } else if (this.selectedItems.length === 1) {
          this.cart.removeItem(this.selectedItems[0].productId);
        } else {
          this.cart.clearCart();
        }

        if (this.form.paymentMethod === 'VNPAY') {
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
        this.router.navigate(['/success'], { queryParams: { id: idToNavigate } });
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