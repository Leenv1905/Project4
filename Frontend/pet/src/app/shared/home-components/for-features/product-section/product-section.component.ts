import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductGroupComponent } from './product-group/product-group.component';
import {Product} from '../../../../core/models/product.model';

@Component({
  standalone: true,
  selector: 'app-product-section',
  imports: [CommonModule, ProductGroupComponent],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {

  groups: { title: string; products: Product[] }[] = [];
  error: string | null = null;

  ngOnInit(): void {
    this.loadMockProducts();
  }

  private loadMockProducts() {
    try {
      // Sử dụng mock data mới (nếu bạn đã tạo MOCK_PRODUCTS theo model mới)
      // Hoặc tạo tạm ở đây để phù hợp model mới
      const mockProducts: Product[] = Array.from({ length: 16 }).map((_, i) => ({
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

      this.groups = [
        {
          title: '🐶 Poodle Hot',
          products: mockProducts.filter(p => p.breed === 'Poodle').slice(0, 4)
        },
        {
          title: '🐕 Corgi Siêu Dễ Thương',
          products: mockProducts.filter(p => p.breed === 'Corgi').slice(0, 4)
        },
        {
          title: '🔥 Bán Chạy Nhất Tuần',
          products: [...mockProducts].sort(() => Math.random() - 0.5).slice(0, 4)
        },
        {
          title: '✨ Mới Về - Fresh Arrival',
          products: mockProducts.slice(8, 12)
        }
      ];

    } catch (err) {
      console.error(err);
      this.error = 'Không thể tải sản phẩm. Vui lòng thử lại sau.';
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Product } from '../../../../core/models/product.model';
// import { ProductGroupComponent } from './product-group/product-group.component';
//
// @Component({
//   standalone: true,
//   selector: 'app-product-section',
//   imports: [CommonModule, ProductGroupComponent],
//   templateUrl: './product-section.component.html',
//   styleUrls: ['./product-section.component.scss']
// })
// export class ProductSectionComponent implements OnInit {
//
//   groups: { title: string; products: Product[] }[] = [];
//   error: string | null = null;
//
//   ngOnInit(): void {
//     this.loadMockProducts();
//   }
//
//   private loadMockProducts() {
//     try {
//       const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
//         id: i + 1,
//         name: `Chó ${i % 2 === 0 ? 'Poodle' : 'Corgi'} ${i + 1}`,
//         description: 'Chó cảnh dễ thương, thân thiện.',
//         price: 3000000 + i * 500000,
//         images: ['/assets/cho21.jpg'],
//         video: '',
//         breed: i % 2 === 0 ? 'Poodle' : 'Corgi',
//         dogType: i % 3 === 0 ? 'Tiny' : 'Mini',
//         shopName: `Pet Shop ${i + 1}`
//       }));
//
//       this.groups = [
//         {
//           title: '🐶 Poodle',
//           products: mockProducts.filter(p => p.breed === 'Poodle').slice(0, 3)
//         },
//         {
//           title: '🐶 Corgi',
//           products: mockProducts.filter(p => p.breed === 'Corgi').slice(0, 3)
//         },
//         {
//           title: '🔥 Bán chạy',
//           products: mockProducts.slice(0, 3)
//         },
//         {
//           title: '✨ Mới về',
//           products: mockProducts.slice(3, 6)
//         }
//       ];
//
//     } catch {
//       this.error = 'Failed to load products';
//     }
//   }
// }
