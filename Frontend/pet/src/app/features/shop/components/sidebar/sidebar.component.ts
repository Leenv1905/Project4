import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopService } from '../../services/shop.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})

export class SidebarComponent {
  shopService = inject(ShopService);

  // English labels for UI
  speciesList = ['Dog', 'Cat', 'Other'] as const;

  breeds = [
    'Poodle',
    'Corgi',
    'Husky',
    'Golden Retriever',
    'Pomeranian',
    'British Shorthair',
    'Scottish Fold',
  ];

  colors = ['White', 'Yellow', 'Gray', 'Black', 'Brown', 'Bicolor'];

  genders = [
    { label: 'Male', value: 'male' as const },
    { label: 'Female', value: 'female' as const },
  ];

  weightRanges = [
    { label: 'Small (< 5kg)', value: 'light' as const },
    { label: 'Medium (5–15kg)', value: 'medium' as const },
    { label: 'Large (> 15kg)', value: 'heavy' as const },
  ];

  priceRanges = [
    { label: 'Under 5 million VND', value: 'low' as const },
    { label: '5 – 10 million VND', value: 'medium' as const },
    { label: 'Above 10 million VND', value: 'high' as const },
  ];

  // Mapping English → Vietnamese for ShopService
  speciesMap = {
    Dog: 'Chó',
    Cat: 'Mèo',
    Other: 'Khác',
  } as const;

  // Methods
  selectSpecies(species: 'Dog' | 'Cat' | 'Other') {
    const mapped = this.speciesMap[species];
    this.shopService.updateFilter({ species: mapped });
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
