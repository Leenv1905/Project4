import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {Product} from '../../../core/models/product.model';
import {CartService} from '../../../core/services/cart.service';
import {AuthService} from '../../../core/services/auth.service';
import {ShopService} from '../../shop/services/shop.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly auth = inject(AuthService);
  private readonly shop = inject(ShopService);
  private readonly snackBar = inject(MatSnackBar);

  readonly product = signal<Product | null>(null);
  readonly selectedImageIndex = signal(0);
  readonly alreadyInCart = computed(() => {
    const p = this.product();
    return p ? this.cart.isInCart(p.id) : false;
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      return;
    }

    const cached = this.shop.getProductById(id);
    if (cached) {
      this.product.set(cached);
      return;
    }

    this.shop.getPublicPets().subscribe({
      next: (products) => {
        const found = products.find((product) => product.id === id) || null;
        if (found) {
          // Convert images from object[] → string[]
          found.images = (found.images || [])
            .map((img: any) => img.imageUrl || img.originalImageUrl || img.aiRenderedUrl)
            .filter((url: string) => !!url); // remove null
        }
        this.product.set(found);
      }
    });
  }

  get currentImage(): string {
    const product = this.product();
    if (!product || product.images.length === 0) {
      return '';
    }

    return product.images[this.selectedImageIndex()];
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  addToCart() {
    if (!this.auth.isAuthenticated()) {
      this.snackBar.open('Vui lòng đăng nhập để thực hiện chức năng này', 'Đóng', {duration: 5000});
      this.auth.openLogin();
      return;
    }

    const product = this.product();
    if (!product || product.status?.toLowerCase() !== 'available') {
      return;
    }

    this.cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || '',
      shopName: product.shopName
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Đã thêm vào giỏ hàng!', 'Đóng', {duration: 3000});
        } else {
          this.snackBar.open(res.message, 'Đóng', {duration: 5000});
        }
      },
      error: () => {
        this.snackBar.open('Lỗi khi thêm vào giỏ hàng', 'Đóng', {duration: 5000});
      }
    });
  }

  buyNow() {
    if (!this.auth.isAuthenticated()) {
      this.snackBar.open('Vui lòng đăng nhập để thực hiện chức năng này', 'Đóng', {duration: 5000});
      this.auth.openLogin();
      return;
    }

    const product = this.product();
    if (!product || product.status?.toLowerCase() !== 'available') {
      return;
    }

    // Không thêm vào giỏ hàng — truyền thông tin sản phẩm qua router state
    this.router.navigate(['/checkout'], {
      queryParams: { mode: 'single', productId: product.id },
      state: {
        buyNowItem: {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images[0] || '',
          shopName: product.shopName || ''
        }
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Còn hàng';
      case 'sold':
        return 'Đã bán';
      case 'reserved':
        return 'Đã đặt trước';
      case 'not_for_sale':
        return 'Không bán';
      default:
        return status;
    }
  }

  getGenderLabel(gender: 'male' | 'female'): string {
    return gender === 'male' ? 'Đực' : 'Cái';
  }
}
