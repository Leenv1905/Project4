import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { generateMockProducts } from '../../shop/data/mock-products'; // ← Dùng hàm generate
import { CartService } from '../../../core/services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  route = inject(ActivatedRoute);
  cart = inject(CartService);

  product = signal<Product | null>(null);
  selectedImageIndex = signal(0);

  // Danh sách mock đầy đủ
  private allProducts = generateMockProducts(30);   // Tạo 30 sản phẩm

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const found = this.allProducts.find(p => p.id === id);

    if (found) {
      this.product.set(found);
    } else {
      console.warn(`Không tìm thấy sản phẩm với id = ${id}`);
    }
  }

  get currentImage(): string {
    const p = this.product();
    if (!p || p.images.length === 0) return '';
    return p.images[this.selectedImageIndex()];
  }

  selectImage(index: number) {
    this.selectedImageIndex.set(index);
  }

  addToCart() {
    const p = this.product();
    if (!p || p.status !== 'available') return;

    this.cart.addToCart({
      productId: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image: p.images[0] || '',
      shopName: p.shopName
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available': return 'Còn hàng';
      case 'sold': return 'Đã bán';
      case 'reserved': return 'Đã đặt trước';
      case 'not_for_sale': return 'Không bán';
      default: return status;
    }
  }

  getGenderLabel(gender: 'male' | 'female'): string {
    return gender === 'male' ? 'Đực' : 'Cái';
  }
}

// import { Component, inject, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
//
// import { Product } from '../../../core/models/product.model';
// import { MOCK_PRODUCTS } from '../../shop/data/mock-products'; // tạm dùng mock
// import { CartService } from '../../../core/services/cart.service';
//
// @Component({
//   standalone: true,
//   selector: 'app-product-detail',
//   imports: [CommonModule],
//   templateUrl: './product-detail.component.html',
//   styleUrls: ['./product-detail.component.scss']
// })
// export class ProductDetailComponent implements OnInit {
//
//   route = inject(ActivatedRoute);
//   cart = inject(CartService);
//
//   product = signal<Product | null>(null);
//   selectedImage = signal<string>('');
//   quantity = signal<number>(1);
//
//   ngOnInit() {
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//
//     // mock mapping (sau này replace API)
//     const found = MOCK_PRODUCTS.find(p => p.id === id);
//
//     if (found) {
//       const mapped: Product = {
//         id: found.id,
//         name: found.name,
//         description: 'Chó khỏe mạnh, đã tiêm phòng đầy đủ.',
//         price: found.price,
//         images: [found.image],
//         breed: found.breed,
//         dogType: found.dogType,
//         shopName: found.shopName
//       };
//
//       this.product.set(mapped);
//       this.selectedImage.set(mapped.images[0]);
//     }
//   }
//
//   selectImage(img: string) {
//     this.selectedImage.set(img);
//   }
//
//   increaseQty() {
//     this.quantity.update(q => q + 1);
//   }
//
//   decreaseQty() {
//     this.quantity.update(q => Math.max(1, q - 1));
//   }
//
//   addToCart() {
//     const p = this.product();
//     if (!p) return;
//
//     this.cart.addToCart({
//       productId: p.id,
//       name: p.name,
//       price: p.price,
//       image: p.images[0],
//       shopName: p.shopName,
//       quantity: this.quantity()
//     });
//   }
// }
