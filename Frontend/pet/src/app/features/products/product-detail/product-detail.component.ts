import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { MOCK_PRODUCTS } from '../../shop/data/mock-products'; // tạm dùng mock
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
  selectedImage = signal<string>('');
  quantity = signal<number>(1);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // mock mapping (sau này replace API)
    const found = MOCK_PRODUCTS.find(p => p.id === id);

    if (found) {
      const mapped: Product = {
        id: found.id,
        name: found.name,
        description: 'Chó khỏe mạnh, đã tiêm phòng đầy đủ.',
        price: found.price,
        images: [found.image],
        breed: found.breed,
        dogType: found.dogType,
        shopName: found.shopName
      };

      this.product.set(mapped);
      this.selectedImage.set(mapped.images[0]);
    }
  }

  selectImage(img: string) {
    this.selectedImage.set(img);
  }

  increaseQty() {
    this.quantity.update(q => q + 1);
  }

  decreaseQty() {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    this.cart.addToCart({
      productId: p.id,
      name: p.name,
      price: p.price,
      image: p.images[0],
      shopName: p.shopName,
      quantity: this.quantity()
    });
  }
}
