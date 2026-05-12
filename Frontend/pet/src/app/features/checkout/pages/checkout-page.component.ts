import { Component, inject, computed, OnInit, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CartService } from '../../../core/services/cart.service';
import { CheckoutService } from '../services/checkout.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  UserProfileService,
  UserAddress,
  CreateAddressPayload,
} from '../../../core/services/user-profile.service';

interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  number: string;
  expiry: string;
  icon: string;
  isDefault: boolean;
}

@Component({
  standalone: true,
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
})
export class CheckoutPageComponent implements OnInit {
  cart = inject(CartService);
  checkout = inject(CheckoutService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  profileService = inject(UserProfileService);

  selectedItems: any[] = [];
  isSubmitting = false;
  private buyNowItem: any = null;

  // Địa chỉ
  addresses: UserAddress[] = [];
  selectedAddressId: number | null = null;
  selectedAddress: UserAddress | null = null;
  isLoadingAddresses = false;
  showChangeAddress = false;

  // Form thêm địa chỉ mới
  isSavingAddress = false;
  newAddress: CreateAddressPayload = {
    receiverName: '',
    phone: '',
    address: '',
    isDefault: false,
  };

  form = {
    customerName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD',
  };
  trackAddress(index: number, item: UserAddress) {
    return item.id;
  }

  // Payment Methods
  paymentMethods = signal<PaymentMethod[]>([
    {
      id: 1,
      type: 'visa',
      name: 'Visa',
      number: '•••• •••• •••• 4242',
      expiry: '12/28',
      icon: '/assets/payment/visa.png',
      isDefault: true,
    },
    {
      id: 2,
      type: 'mastercard',
      name: 'Mastercard',
      number: '•••• •••• •••• 8888',
      expiry: '09/27',
      icon: '/assets/payment/mastercard.png',
      isDefault: false,
    },
    {
      id: 3,
      type: 'momo',
      name: 'MoMo Wallet',
      number: '0987 654 321',
      expiry: '',
      icon: '/assets/payment/momo.png',
      isDefault: false,
    },
  ]);

  selectedPaymentId = 1;
  selectedPaymentMethod: PaymentMethod | null = null;
  paymentDropdownOpen = false;

  total = computed(() =>
    this.selectedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
  );

  ngOnInit() {
    this.initDefaultPayment();
    this.loadCheckoutData();
    this.loadAddresses();
  }

  private initDefaultPayment() {
    const defaultMethod =
      this.paymentMethods().find((m) => m.isDefault) || this.paymentMethods()[0];
    if (defaultMethod) {
      this.selectPayment(defaultMethod);
    }
  }

  private loadCheckoutData() {
    const state = history.state as { buyNowItem?: any };
    const params = this.route.snapshot.queryParams;

    if (params['mode'] === 'single' && params['productId']) {
      if (state?.buyNowItem) {
        this.buyNowItem = state.buyNowItem;
        this.selectedItems = [state.buyNowItem];
      } else {
        const item = this.cart.items().find((i) => i.productId === +params['productId']);
        if (item) this.selectedItems = [item];
        else
          this.cart
            .loadCart()
            .subscribe(
              () =>
                (this.selectedItems = [
                  this.cart.items().find((i) => i.productId === +params['productId'])!,
                ]),
            );
      }
    } else {
      if (this.cart.items().length > 0) {
        this.selectedItems = [...this.cart.items()];
      } else {
        this.cart.loadCart().subscribe(() => (this.selectedItems = [...this.cart.items()]));
      }
    }
  }

  loadAddresses() {
    this.isLoadingAddresses = true;
    this.profileService.getMyAddresses().subscribe({
      next: (list) => {
        this.isLoadingAddresses = false;
        this.addresses = list || [];

        const defaultAddr = list?.find((a) => a.isDefault) || list?.[0];
        if (defaultAddr) {
          this.applyAddress(defaultAddr);
        } else {
          this.fallbackToUserProfile();
        }
      },
      error: () => {
        this.isLoadingAddresses = false;
        this.fallbackToUserProfile();
      },
    });
  }

  private fallbackToUserProfile() {
    const user = this.auth.user();
    if (user) {
      this.form.customerName = user.name || '';
      this.form.phone = user.phone || '';
      this.form.address = user.address || '';
      this.selectedAddress = {
        id: -1,
        receiverName: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        isDefault: true,
      } as UserAddress;
    }
  }

  private applyAddress(addr: UserAddress) {
    this.selectedAddressId = addr.id;
    this.selectedAddress = addr;
    this.form.customerName = addr.receiverName;
    this.form.phone = addr.phone;
    this.form.address = addr.address;
  }

  selectAddress(addr: UserAddress) {
    this.applyAddress(addr);
  }

  toggleNewAddressForm() {
    this.showChangeAddress = !this.showChangeAddress;
    if (this.showChangeAddress) {
      this.newAddress = { receiverName: '', phone: '', address: '', isDefault: false };
    }
  }

  saveNewAddress() {
    if (!this.newAddress.receiverName || !this.newAddress.phone || !this.newAddress.address) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSavingAddress = true;
    this.profileService.createAddress(this.newAddress).subscribe({
      next: (saved) => {
        this.isSavingAddress = false;
        this.addresses = this.newAddress.isDefault
          ? [...this.addresses.map((a) => ({ ...a, isDefault: false })), saved]
          : [...this.addresses, saved];

        this.applyAddress(saved);
        this.showChangeAddress = false;
        this.snackBar.open('New address saved successfully', 'Close', { duration: 2000 });
      },
      error: () => {
        this.isSavingAddress = false;
        this.snackBar.open('Failed to save address', 'Close', { duration: 3000 });
      },
    });
  }

  confirmAddressSelection() {
    this.showChangeAddress = false;
  }

  cancelChangeAddress() {
    this.showChangeAddress = false;
    this.newAddress = { receiverName: '', phone: '', address: '', isDefault: false };
  }

  selectPayment(method: PaymentMethod | null) {
    if (!method) {
      this.selectedPaymentId = 0;
      this.selectedPaymentMethod = null;
      this.form.paymentMethod = 'COD';
    } else {
      this.selectedPaymentId = method.id;
      this.selectedPaymentMethod = method;
      const map: Record<string, string> = { visa: 'CARD', mastercard: 'CARD', momo: 'MOMO' };
      this.form.paymentMethod = map[method.type] ?? 'CARD';
    }
    this.paymentDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.pm-dropdown')) {
      this.paymentDropdownOpen = false;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/placeholder-pet.png';
  }

  placeOrder() {
    if (this.selectedItems.length === 0) {
      this.snackBar.open('No items to checkout!', 'Close', { duration: 3000 });
      return;
    }

    if (!this.selectedAddress || !this.form.address) {
      this.snackBar.open('Please select or add a delivery address', 'Close', { duration: 4000 });
      return;
    }

    this.isSubmitting = true;

    const payload = {
      customerName: this.form.customerName,
      phone: this.form.phone,
      address: this.form.address,
      note: this.form.note,
      paymentMethod: this.form.paymentMethod,
      addressId:
        this.selectedAddressId && this.selectedAddressId > 0 ? this.selectedAddressId : undefined,
    };

    if (this.buyNowItem) {
      this.cart.addToCart(this.buyNowItem).subscribe({
        next: () => this.doPlaceOrder(payload),
        error: () => {
          this.isSubmitting = false;
          this.snackBar.open('Failed to add item', 'Close', { duration: 3000 });
        },
      });
    } else {
      this.doPlaceOrder(payload);
    }
  }

  private doPlaceOrder(payload: any) {
    this.checkout.placeOrder(payload).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        const orderId = Array.isArray(result) ? result[0]?.id : result?.id;

        // Clear cart
        if (this.buyNowItem) this.cart.clearCart();
        else this.cart.clearCart();

        if (this.form.paymentMethod === 'VNPAY' && orderId) {
          this.checkout.createVNPayUrl(orderId).subscribe({
            next: (res: any) => (window.location.href = res?.url || ''),
            error: () => this.router.navigate(['/success'], { queryParams: { id: orderId } }),
          });
        } else {
          this.router.navigate(['/success'], { queryParams: { id: orderId } });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(err?.error?.message || 'Order failed. Please try again.', 'Close', {
          duration: 5000,
        });
      },
    });
  }
}

// import { Component, inject, computed, OnInit, signal, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
//
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
//
// import { CartService } from '../../../core/services/cart.service';
// import { CheckoutService } from '../services/checkout.service';
// import { AuthService } from '../../../core/services/auth.service';
// import { UserProfileService, UserAddress, CreateAddressPayload } from '../../../core/services/user-profile.service';
//
// // Nếu bạn có AccountPaymentService thì inject từ đó.
// // Hiện tại dùng interface + mock data giống AccountPaymentComponent.
// interface PaymentMethod {
//   id: number;
//   type: string;
//   name: string;
//   number: string;
//   expiry: string;
//   icon: string;
//   isDefault: boolean;
// }
//
// @Component({
//   standalone: true,
//   selector: 'app-checkout-page',
//   imports: [CommonModule, FormsModule, MatSnackBarModule],
//   templateUrl: './checkout-page.component.html',
//   styleUrls: ['./checkout-page.component.scss'],
// })
// export class CheckoutPageComponent implements OnInit {
//   cart = inject(CartService);
//   checkout = inject(CheckoutService);
//   auth = inject(AuthService);
//   route = inject(ActivatedRoute);
//   router = inject(Router);
//   snackBar = inject(MatSnackBar);
//   profileService = inject(UserProfileService);
//
//   selectedItems: any[] = [];
//   isSubmitting = false;
//
//   private buyNowItem: any = null;
//
//   // Địa chỉ
//   addresses: UserAddress[] = [];
//   selectedAddressId: number | null = null;
//   selectedAddress: UserAddress | null = null;
//   isLoadingAddresses = false;
//
//   // UI state
//   showChangeAddress = false;
//
//   // Form thêm địa chỉ mới
//   isSavingAddress = false;
//   newAddress: CreateAddressPayload = {
//     receiverName: '',
//     phone: '',
//     address: '',
//     isDefault: false,
//   };
//
//   form = {
//     customerName: '',
//     phone: '',
//     address: '',
//     note: '',
//     paymentMethod: 'COD', // Giữ để tương thích với BE
//   };
//
//   // ===== PAYMENT METHODS =====
//   // TODO: Thay bằng inject(AccountPaymentService).paymentMethods nếu có service chung
//   paymentMethods = signal<PaymentMethod[]>([
//     {
//       id: 1,
//       type: 'visa',
//       name: 'Visa',
//       number: '•••• •••• •••• 4242',
//       expiry: '12/28',
//       icon: '/assets/payment/visa.png',
//       isDefault: true,
//     },
//     {
//       id: 2,
//       type: 'mastercard',
//       name: 'Mastercard',
//       number: '•••• •••• •••• 8888',
//       expiry: '09/27',
//       icon: '/assets/payment/mastercard.png',
//       isDefault: false,
//     },
//     {
//       id: 3,
//       type: 'momo',
//       name: 'MoMo Wallet',
//       number: '0987 654 321',
//       expiry: '',
//       icon: '/assets/payment/momo.png',
//       isDefault: false,
//     },
//   ]);
//
//   // Mặc định chọn Visa (isDefault = true, id = 1)
//   selectedPaymentId: number = 1;
//   selectedPaymentMethod: PaymentMethod | null = null;
//   paymentDropdownOpen = false;
//
//   /** Chọn phương thức thanh toán, đóng dropdown */
//   selectPayment(method: PaymentMethod | null) {
//     if (!method) {
//       this.selectedPaymentId = 0;
//       this.selectedPaymentMethod = null;
//       this.form.paymentMethod = 'COD';
//     } else {
//       this.selectedPaymentId = method.id;
//       this.selectedPaymentMethod = method;
//       const typeMap: Record<string, string> = {
//         visa: 'CARD',
//         mastercard: 'CARD',
//         momo: 'MOMO',
//       };
//       this.form.paymentMethod = typeMap[method.type] ?? 'CARD';
//     }
//     this.paymentDropdownOpen = false;
//   }
//
//   /** Đóng payment dropdown khi click ra ngoài */
//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     const target = event.target as HTMLElement;
//     if (!target.closest('.pm-dropdown')) {
//       this.paymentDropdownOpen = false;
//     }
//   }
//
//   ngOnInit() {
//     // Đặt mặc định Visa (phương thức isDefault hoặc đầu tiên)
//     const defaultMethod =
//       this.paymentMethods().find((m) => m.isDefault) ?? this.paymentMethods()[0];
//     if (defaultMethod) {
//       this.selectedPaymentId = defaultMethod.id;
//       this.selectedPaymentMethod = defaultMethod;
//       const typeMap: Record<string, string> = { visa: 'CARD', mastercard: 'CARD', momo: 'MOMO' };
//       this.form.paymentMethod = typeMap[defaultMethod.type] ?? 'CARD';
//     }
//
//     const state = history.state as { buyNowItem?: any };
//
//     this.route.queryParams.subscribe((params) => {
//       const mode = params['mode'];
//       const productId = Number(params['productId']);
//
//       if (mode === 'single' && productId) {
//         if (state?.buyNowItem) {
//           this.buyNowItem = state.buyNowItem;
//           this.selectedItems = [state.buyNowItem];
//         } else {
//           const item = this.cart.items().find((i) => i.productId === productId);
//           if (item) {
//             this.selectedItems = [item];
//           } else {
//             this.cart.loadCart().subscribe(() => {
//               const found = this.cart.items().find((i) => i.productId === productId);
//               if (found) this.selectedItems = [found];
//             });
//           }
//         }
//       } else {
//         if (this.cart.items().length > 0) {
//           this.selectedItems = [...this.cart.items()];
//         } else {
//           this.cart.loadCart().subscribe(() => {
//             this.selectedItems = [...this.cart.items()];
//           });
//         }
//       }
//     });
//
//     this.loadAddresses();
//   }
//
//   loadAddresses() {
//     this.isLoadingAddresses = true;
//     this.profileService.getMyAddresses().subscribe({
//       next: (list) => {
//         this.isLoadingAddresses = false;
//         this.addresses = list || [];
//
//         // Ưu tiên: địa chỉ default → địa chỉ đầu tiên → thông tin từ AuthService
//         const defaultAddr = (list || []).find((a) => a.isDefault) || (list || [])[0];
//
//         if (defaultAddr) {
//           this.applyAddress(defaultAddr);
//         } else {
//           // Fallback: đọc từ AuthService nếu user có address
//           const user = this.auth.user();
//           if (user?.address) {
//             this.form.customerName = user.name || '';
//             this.form.phone = user.phone || '';
//             this.form.address = user.address;
//             // Tạo object tạm để hiển thị
//             this.selectedAddress = {
//               id: -1,
//               receiverName: user.name || '',
//               phone: user.phone || '',
//               address: user.address,
//               isDefault: true,
//             } as UserAddress;
//           }
//         }
//       },
//       error: () => {
//         this.isLoadingAddresses = false;
//         // Fallback khi API lỗi: đọc từ AuthService
//         const user = this.auth.user();
//         if (user?.address) {
//           this.form.customerName = user.name || '';
//           this.form.phone = user.phone || '';
//           this.form.address = user.address;
//           this.selectedAddress = {
//             id: -1,
//             receiverName: user.name || '',
//             phone: user.phone || '',
//             address: user.address,
//             isDefault: true,
//           } as UserAddress;
//         }
//       },
//     });
//   }
//
//   /** Áp dụng địa chỉ vào form và state hiển thị */
//   private applyAddress(addr: UserAddress) {
//     this.selectedAddressId = addr.id;
//     this.selectedAddress = addr;
//     this.form.customerName = addr.receiverName;
//     this.form.phone = addr.phone;
//     this.form.address = addr.address;
//   }
//
//   trackAddress(_index: number, addr: UserAddress) {
//     return addr.id;
//   }
//
//   selectAddress(addr: UserAddress) {
//     this.applyAddress(addr);
//     // Không đóng panel ngay — user cần bấm "Xác Nhận"
//   }
//
//   /** Xác nhận chọn địa chỉ từ danh sách → đóng panel */
//   confirmAddressSelection() {
//     this.showChangeAddress = false;
//   }
//
//   /** Hủy thay đổi → đóng panel, không thay đổi gì */
//   cancelChangeAddress() {
//     this.showChangeAddress = false;
//     // Reset form thêm mới
//     this.newAddress = { receiverName: '', phone: '', address: '', isDefault: false };
//   }
//
//   saveNewAddress() {
//     if (!this.newAddress.receiverName || !this.newAddress.phone || !this.newAddress.address) {
//       this.snackBar.open('Vui lòng nhập đầy đủ thông tin địa chỉ', 'Đóng', { duration: 3000 });
//       return;
//     }
//     this.isSavingAddress = true;
//     this.profileService.createAddress(this.newAddress).subscribe({
//       next: (saved) => {
//         this.isSavingAddress = false;
//         this.addresses = this.newAddress.isDefault
//           ? [...this.addresses.map((a) => ({ ...a, isDefault: false })), saved]
//           : [...this.addresses, saved];
//         this.profileService.invalidateAddressCache();
//         this.applyAddress(saved);
//         this.showChangeAddress = false;
//         this.newAddress = { receiverName: '', phone: '', address: '', isDefault: false };
//         this.snackBar.open('Đã lưu địa chỉ mới', 'Đóng', { duration: 2000 });
//       },
//       error: () => {
//         this.isSavingAddress = false;
//         this.snackBar.open('Không thể lưu địa chỉ', 'Đóng', { duration: 3000 });
//       },
//     });
//   }
//
//   onImageError(event: Event) {
//     (event.target as HTMLImageElement).src = 'assets/images/placeholder-pet.png';
//   }
//
//   total = computed(() =>
//     this.selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
//   );
//
//   placeOrder() {
//     if (this.selectedItems.length === 0) {
//       this.snackBar.open('Không có sản phẩm nào để thanh toán!', 'Đóng', { duration: 3000 });
//       return;
//     }
//
//     if (!this.form.customerName || !this.form.phone || !this.form.address) {
//       this.snackBar.open('Vui lòng chọn hoặc nhập địa chỉ nhận hàng', 'Đóng', { duration: 5000 });
//       return;
//     }
//
//     this.isSubmitting = true;
//
//     if (this.buyNowItem) {
//       this.cart.addToCart(this.buyNowItem).subscribe({
//         next: () => this.doPlaceOrder(),
//         error: () => {
//           this.isSubmitting = false;
//           this.snackBar.open('Không thể thêm sản phẩm vào giỏ hàng', 'Đóng', { duration: 3000 });
//         },
//       });
//     } else {
//       this.doPlaceOrder();
//     }
//   }
//
//   private doPlaceOrder() {
//     const payload = {
//       ...this.form,
//       addressId:
//         this.selectedAddressId && this.selectedAddressId > 0 ? this.selectedAddressId : undefined,
//     };
//
//     this.checkout.placeOrder(payload).subscribe({
//       next: (createdOrder) => {
//         this.isSubmitting = false;
//
//         if (!createdOrder) {
//           this.snackBar.open('Không thể tạo đơn hàng.', 'Đóng', { duration: 5000 });
//           return;
//         }
//
//         if (this.buyNowItem) {
//           this.cart.clearCart();
//         } else if (this.selectedItems.length === 1) {
//           this.cart.removeItem(this.selectedItems[0].productId);
//         } else {
//           this.cart.clearCart();
//         }
//
//         if (this.form.paymentMethod === 'VNPAY') {
//           const orderId = Array.isArray(createdOrder) ? createdOrder[0]?.id : createdOrder.id;
//           if (orderId) {
//             this.checkout.createVNPayUrl(orderId).subscribe({
//               next: (res: any) => {
//                 if (res?.url) {
//                   window.location.href = res.url;
//                 } else {
//                   this.snackBar.open('Lỗi tạo URL thanh toán VNPay', 'Đóng', { duration: 5000 });
//                   this.router.navigate(['/success'], { queryParams: { id: orderId } });
//                 }
//               },
//               error: () => {
//                 this.snackBar.open('Lỗi kết nối VNPay', 'Đóng', { duration: 5000 });
//                 this.router.navigate(['/success'], { queryParams: { id: orderId } });
//               },
//             });
//             return;
//           }
//         }
//
//         const idToNavigate = Array.isArray(createdOrder) ? createdOrder[0]?.id : createdOrder.id;
//         this.router.navigate(['/success'], { queryParams: { id: idToNavigate } });
//       },
//       error: (err) => {
//         this.isSubmitting = false;
//         const message = err?.error?.message || err?.error || 'Đặt hàng thất bại. Vui lòng thử lại.';
//         this.snackBar.open(message, 'Đóng', { duration: 5000 });
//       },
//     });
//   }
// }
