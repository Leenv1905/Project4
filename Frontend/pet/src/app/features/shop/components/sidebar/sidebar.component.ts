import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopService } from '../../services/shop.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  shopService = inject(ShopService);

  // Danh sách lọc
  speciesList = ['Chó', 'Mèo', 'Khác'] as const;

  breeds = [
    'Poodle', 'Corgi', 'Husky', 'Golden Retriever',
    'Pomeranian', 'British Shorthair', 'Scottish Fold'
  ];

  colors = ['Trắng', 'Vàng', 'Xám', 'Đen', 'Nâu', 'Bicolor'];

  genders = [
    { label: 'Đực', value: 'male' as const },
    { label: 'Cái', value: 'female' as const }
  ];

  weightRanges = [
    { label: 'Nhỏ (< 5kg)', value: 'light' as const },
    { label: 'Trung bình (5-15kg)', value: 'medium' as const },
    { label: 'Lớn (> 15kg)', value: 'heavy' as const }
  ];

  priceRanges = [
    { label: 'Dưới 5 triệu', value: 'low' as const },
    { label: '5 - 10 triệu', value: 'medium' as const },
    { label: 'Trên 10 triệu', value: 'high' as const }
  ];

  // Methods - Đã fix type
  selectSpecies(species: 'Chó' | 'Mèo' | 'Khác') {
    this.shopService.updateFilter({ species });
  }

  selectBreed(breed: string) {
    this.shopService.updateFilter({ breed });
  }

  selectColor(color: string) {
    this.shopService.updateFilter({ color });
  }

  selectGender(gender: 'male' | 'female') {
    this.shopService.updateFilter({ gender });
  }

  selectWeightRange(range: 'light' | 'medium' | 'heavy') {
    this.shopService.updateFilter({ weightRange: range });
  }

  selectPriceRange(range: 'low' | 'medium' | 'high') {
    this.shopService.updateFilter({ priceRange: range });
  }

  clearFilters() {
    this.shopService.resetFilters();
  }
}
