import { Component, inject, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShopService } from '../../services/shop.service';

@Component({
  standalone: true,
  selector: 'app-product-filter',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit{

  shopService = inject(ShopService);
  searchTimeout: any = null;
  searchQuery = '';
  sort = '';

  updateSearch() {

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {

      this.shopService.updateFilter({
        searchQuery: this.searchQuery
      });

    }, 300);

  }

  updateSort() {
    this.shopService.updateFilter({
      sort: this.sort as any
    });
  }

  ngOnInit() {
    const f = this.shopService.filters();

    this.searchQuery = f.searchQuery || '';
    this.sort = f.sort || '';
  }
// 👉 Có đoạn này:
//   URL → filter → UI sync ✅
//   giống Shopee / Lazada ✅

  clearSearch() {
    this.searchQuery = '';
    this.shopService.updateFilter({ searchQuery: '' });
  }

}
