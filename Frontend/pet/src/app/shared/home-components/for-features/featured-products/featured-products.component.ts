// SẢN PHẨM NỔI BẬT
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Product } from '../../../../core/models/product.model';
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

  featuredProducts: Product[] = [];   // ← Sửa thành cái này
  error: string | null = null;

  ngOnInit(): void {
    this.loadMockProducts();
  }

  private loadMockProducts() {
    try {
      const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: `Chó ${i % 2 === 0 ? 'Poodle' : 'Corgi'} ${i + 1}`,
        description: 'Thú cưng thuần chủng, sức khỏe tốt, đã tiêm vaccine đầy đủ.',
        price: 4500000 + Math.floor(Math.random() * 8000000),
        originalPrice: Math.random() > 0.7 ? 5500000 + Math.floor(Math.random() * 6000000) : undefined,
        images: ['/assets/pets/pet-' + ((i % 6) + 1) + '.jpg'],
        video: undefined,
        status: Math.random() > 0.8 ? 'sold' : 'available',
        species: i % 3 === 0 ? 'Mèo' : 'Chó',
        breed: ['Poodle', 'Corgi', 'Husky', 'Golden Retriever', 'Pomeranian'][i % 5],
        color: ['Trắng', 'Vàng', 'Xám', 'Đen', 'Nâu'][i % 5],
        gender: i % 2 === 0 ? 'male' : 'female',
        weight: 3.5 + Math.random() * 12,
        age: Math.floor(Math.random() * 18) + 4,
        vaccinated: true,
        neutered: Math.random() > 0.4,
        shopId: (i % 3) + 1,
        shopName: `Pet Shop ${(i % 3) + 1}`,
        createdAt: new Date()
      }));

      // Lấy 8 sản phẩm nổi bật nhất để hiển thị trong Featured
      this.featuredProducts = [...mockProducts]
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

    } catch (err) {
      console.error(err);
      this.error = 'Không thể tải sản phẩm nổi bật.';
    }
  }
}
  // private loadMockProducts() {
  //   try {
  //     const mock: Product[] = Array.from({ length: 8 }).map((_, i) => ({
  //       id: i + 1,
  //       name: `Chó Poodle ${i + 1}`,
  //       description: 'Chó cảnh dễ thương, thân thiện, phù hợp nuôi trong nhà.',
  //       price: 3000000 + i * 500000,
  //
  //       images: [
  //         '/assets/cho1.jpg' // phải là array để phù hợp với model
  //       ],
  //
  //       video: '',
  //
  //       breed: 'Poodle',
  //       dogType: i % 2 === 0 ? 'Tiny' : 'Mini',
  //
  //       shopName: `Pet Shop ${i + 1}`
  //     }));
  //
  //     this.products = mock;
  //
  //   } catch (e) {
  //     this.error = 'Failed to load products.';
  //   }
  // }


