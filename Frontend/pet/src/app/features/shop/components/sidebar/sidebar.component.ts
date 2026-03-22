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

  // 🐶 Breed
  breeds = [
    'Poodle',
    'Corgi',
    'Husky',
    'Golden',
    'Pomeranian'
  ];

  // 🐕 Dog Type
  dogTypes = [
    'Tiny',
    'Mini',
    'Standard'
  ];

  // 💰 Price
  priceRanges = [
    { label: 'Dưới 4 triệu', value: 'low' },
    { label: '4 - 7 triệu', value: 'medium' },
    { label: 'Trên 7 triệu', value: 'high' }
  ];

  selectBreed(breed: string) {
    this.shopService.updateFilter({ breed });
  }

  selectDogType(type: string) {
    this.shopService.updateFilter({ dogType: type });
  }

  selectPrice(priceRange: string) {
    this.shopService.updateFilter({ priceRange: priceRange as any });
  }

  clearFilters() {
    this.shopService.resetFilters();
  }

}
