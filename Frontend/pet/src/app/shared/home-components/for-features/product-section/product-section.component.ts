import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/product.model';
import { ProductGroupComponent } from './product-group/product-group.component';

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
      const mockProducts: Product[] = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: `Chó ${i % 2 === 0 ? 'Poodle' : 'Corgi'} ${i + 1}`,
        description: 'Chó cảnh dễ thương, thân thiện.',
        price: 3000000 + i * 500000,
        images: ['/assets/cho21.jpg'],
        video: '',
        breed: i % 2 === 0 ? 'Poodle' : 'Corgi',
        dogType: i % 3 === 0 ? 'Tiny' : 'Mini',
        shopName: `Pet Shop ${i + 1}`
      }));

      this.groups = [
        {
          title: '🐶 Poodle',
          products: mockProducts.filter(p => p.breed === 'Poodle').slice(0, 3)
        },
        {
          title: '🐶 Corgi',
          products: mockProducts.filter(p => p.breed === 'Corgi').slice(0, 3)
        },
        {
          title: '🔥 Bán chạy',
          products: mockProducts.slice(0, 3)
        },
        {
          title: '✨ Mới về',
          products: mockProducts.slice(3, 6)
        }
      ];

    } catch {
      this.error = 'Failed to load products';
    }
  }
}
