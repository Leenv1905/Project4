import { afterNextRender, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductGroupComponent } from './product-group/product-group.component';
import { Product } from '../../../../core/models/product.model';
import { inject } from '@angular/core';
import { ShopService } from '../../../../features/shop/services/shop.service';

const MOCK_PET_IMAGES = [
  '/assets/cho1.jpg',
  '/assets/cho2.jpg',
  '/assets/cho3.jpg',
  '/assets/cho4.jpg',
  '/assets/cho5.jpg',
  '/assets/cho21.jpg'
];

@Component({
  standalone: true,
  selector: 'app-product-section',
  imports: [CommonModule, ProductGroupComponent],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {

  shop = inject(ShopService);
  groups: { title: string; products: Product[] }[] = [];
  error: string | null = null;

  ngOnInit(): void {
    afterNextRender(() => this.loadProducts());
  }

  private loadProducts() {
    this.shop.getPublicPets().subscribe({
      next: (pets) => {
        if (pets.length > 0) {
          this.groupProducts(pets);
        } else {
          this.loadMockProducts();
        }
      },
      error: () => this.loadMockProducts()
    });
  }

  private groupProducts(all: Product[]) {
    this.groups = [
      {
        title: '🐶 Chó Cảnh Nổi Bật',
        products: all.filter(p => p.species === 'Chó').slice(0, 4)
      },
      {
        title: '🐱 Mèo Cảnh Dễ Thương',
        products: all.filter(p => p.species === 'Mèo').slice(0, 4)
      },
      {
        title: '🔥 Bán Chạy Nhất',
        products: [...all].sort(() => Math.random() - 0.5).slice(0, 4)
      },
      {
        title: '✨ Mới Cập Nhật',
        products: [...all].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 4)
      }
    ];
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
        images: [MOCK_PET_IMAGES[i % MOCK_PET_IMAGES.length]],
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
