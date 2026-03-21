import { Injectable, signal, computed } from '@angular/core';
import { ShopProduct } from '../models/shop-product.model';
import { ShopFilter } from '../models/shop-filter.model';
import { PaginationState } from '../models/pagination.model';
import { MOCK_PRODUCTS } from '../data/mock-products';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

//Để URL Sync Filter (SEO + Share link)
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Sync URL → state
    this.route.queryParams.subscribe(params => {

      this.filters.set({
        breed: params['breed'] || '',
        dogType: params['dogType'] || '',
        searchQuery: params['search'] || '',
        priceRange: params['price'] || ''
      });

      this.pagination.update(p => ({
        ...p,
        page: Number(params['page']) || 1
      }));
//Để URL Sync Filter (SEO + Share link)

    });
  }

  // ===== STATE =====

  private products = signal<ShopProduct[]>(MOCK_PRODUCTS);

  filters = signal<ShopFilter>({});

  pagination = signal<PaginationState>({
    page: 1,
    pageSize: 12
  });

  // ===== FILTER LOGIC =====

  filteredProducts = computed(() => {

    let result = [...this.products()];
    const f = this.filters();

    // 🔍 SEARCH
    if (f.searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(f.searchQuery!.toLowerCase())
      );
    }

    // 🐶 BREED
    if (f.breed) {
      result = result.filter(p => p.breed === f.breed);
    }

    // 🐕 DOG TYPE
    if (f.dogType) {
      result = result.filter(p => p.dogType === f.dogType);
    }

    // 🏪 SHOP
    if (f.shopName) {
      result = result.filter(p => p.shopName === f.shopName);
    }

    // 💰 PRICE RANGE (update theo VND)
    if (f.priceRange) {
      if (f.priceRange === 'low') {
        result = result.filter(p => p.price < 4000000);
      }
      if (f.priceRange === 'medium') {
        result = result.filter(p => p.price >= 4000000 && p.price <= 7000000);
      }
      if (f.priceRange === 'high') {
        result = result.filter(p => p.price > 7000000);
      }
    }

    // 🔄 SORT
    if (f.sort) {
      result.sort((a, b) => {
        switch (f.sort) {
          case 'priceAsc': return a.price - b.price;
          case 'priceDesc': return b.price - a.price;
          case 'nameAsc': return a.name.localeCompare(b.name);
          case 'nameDesc': return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
    }

    return result;
  });

  // ===== PAGINATION =====

  paginatedProducts = computed(() => {

    const { page, pageSize } = this.pagination();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return this.filteredProducts().slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(
      this.filteredProducts().length / this.pagination().pageSize
    );
  });

  // ===== URL SYNC =====

  updateURL() {

    const f = this.filters();

    const queryParams: any = {};

    if (f.breed) queryParams.breed = f.breed;
    if (f.dogType) queryParams.dogType = f.dogType;
    if (f.priceRange) queryParams.price = f.priceRange;
    if (f.searchQuery) queryParams.search = f.searchQuery;

    queryParams.page = this.pagination().page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams
    });
  }

  // ===== ACTIONS =====

  updateFilter(newFilter: Partial<ShopFilter>) {

    this.filters.update(current => {

      const updated = { ...current };

      Object.keys(newFilter).forEach(key => {

        const k = key as keyof ShopFilter;

        if (updated[k] === newFilter[k]) {
          delete updated[k]; // toggle off
        } else {
          updated[k] = newFilter[k] as any;
        }

      });

      return updated;

    });

    this.setPage(1); // reset page
    this.updateURL();
  }

  setPage(page: number) {

    this.pagination.update(p => ({
      ...p,
      page
    }));

    this.updateURL();
  }

  resetFilters() {

    this.filters.set({});

    this.pagination.update(p => ({
      ...p,
      page: 1
    }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }
}
