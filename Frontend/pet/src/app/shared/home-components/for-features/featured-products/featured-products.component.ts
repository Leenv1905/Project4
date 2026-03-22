// SẢN PHẨM NỔI BẬT
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Product } from '../../../models/product.model';
import { ProductSliderComponent } from '../product-slider/product-slider.component';

@Component({
  standalone: true,
  selector: 'app-featured-products',
  imports: [
    CommonModule,
    RouterModule,
    ProductSliderComponent
  ],
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit {

  products: Product[] = [];
  error: string | null = null;

  ngOnInit(): void {
    this.loadMockProducts();
  }

  private loadMockProducts() {
    try {
      const mock: Product[] = Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: `Chó Poodle ${i + 1}`,
        description: 'Chó cảnh dễ thương, thân thiện, phù hợp nuôi trong nhà.',
        price: 3000000 + i * 500000,

        images: [
          '/assets/cho1.jpg' // phải là array để phù hợp với model
        ],

        video: '',

        breed: 'Poodle',
        dogType: i % 2 === 0 ? 'Tiny' : 'Mini',

        shopName: `Pet Shop ${i + 1}`
      }));

      this.products = mock;

    } catch (e) {
      this.error = 'Failed to load products.';
    }
  }
}
