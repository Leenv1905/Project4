import { Injectable, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ShopFilter } from '../models/shop-filter.model';
import { PaginationState } from '../models/pagination.model';
import { MOCK_PRODUCTS, generateMockProducts } from '../data/mock-products';
import {Product} from '../../../core/models/product.model';   //cập nhật mock theo model mới

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Sync URL → State khi thay đổi query params
    this.route.queryParams.subscribe(params => {
      this.filters.set({
        searchQuery: params['search'] || '',
        breed: params['breed'] || '',
        species: params['species'] || '',
        color: params['color'] || '',
        gender: params['gender'] || '',
        priceRange: params['price'] || '',
        sort: params['sort'] || ''
      });

      this.pagination.update(p => ({
        ...p,
        page: Number(params['page']) || 1
      }));
    });
  }

  // ===== STATE =====
  // private products = signal<Product[]>(MOCK_PRODUCTS);
// Sử dụng hàm generate để tạo nhiều dữ liệu động
  private products = signal<Product[]>(generateMockProducts(140));
  filters = signal<ShopFilter>({
    searchQuery: '',
    breed: '',
    species: undefined,
    color: '',
    gender: undefined,
    weightRange: undefined,
    priceRange: undefined,
    sort: undefined,
    shopName: '',
    status: undefined
  });

  pagination = signal<PaginationState>({
    page: 1,
    pageSize: 24
  });

  // ===== FILTERED & PAGINATED PRODUCTS =====
  filteredProducts = computed(() => {
    let result = [...this.products()];
    const f = this.filters();

    // Tìm kiếm theo tên
    if (f.searchQuery) {
      const q = f.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q)
      );
    }

    // Lọc theo giống
    if (f.breed) {
      result = result.filter(p => p.breed === f.breed);
    }

    // Lọc theo loài
    if (f.species) {
      result = result.filter(p => p.species === f.species);
    }

    // Lọc theo màu lông
    if (f.color) {
      result = result.filter(p => p.color === f.color);
    }

    // Lọc theo cân nặng
    if (f.weightRange) {
      if (f.weightRange === 'light') {
        result = result.filter(p => p.weight < 5);
      } else if (f.weightRange === 'medium') {
        result = result.filter(p => p.weight >= 5 && p.weight <= 15);
      } else if (f.weightRange === 'heavy') {
        result = result.filter(p => p.weight > 15);
      }
    }

    // Lọc theo trạng thái
    if (f.status) {
      result = result.filter(p => p.status === f.status);
    }

    // Lọc theo giới tính
    if (f.gender) {
      result = result.filter(p => p.gender === f.gender);
    }

    // Lọc theo khoảng giá
    if (f.priceRange) {
      if (f.priceRange === 'low') {
        result = result.filter(p => p.price < 5000000);
      } else if (f.priceRange === 'medium') {
        result = result.filter(p => p.price >= 5000000 && p.price <= 10000000);
      } else if (f.priceRange === 'high') {
        result = result.filter(p => p.price > 10000000);
      }
    }

    // Sắp xếp
    if (f.sort) {
      result.sort((a, b) => {
        switch (f.sort) {
          case 'priceAsc':  return a.price - b.price;
          case 'priceDesc': return b.price - a.price;
          case 'nameAsc':   return a.name.localeCompare(b.name);
          case 'nameDesc':  return b.name.localeCompare(a.name);
          default: return 0;
        }
      });
    }

    return result;
  });

  // Phân trang
  paginatedProducts = computed(() => {
    const { page, pageSize } = this.pagination();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return this.filteredProducts().slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredProducts().length / this.pagination().pageSize)
  );

  totalItems = computed(() => this.filteredProducts().length);

  // ===== URL SYNC =====
  updateURL() {
    const f = this.filters();
    const queryParams: any = {};

    if (f.searchQuery) queryParams.search = f.searchQuery;
    if (f.breed) queryParams.breed = f.breed;
    if (f.species) queryParams.species = f.species;
    if (f.color) queryParams.color = f.color;
    if (f.gender) queryParams.gender = f.gender;
    if (f.weightRange) queryParams.weight = f.weightRange;
    if (f.priceRange) queryParams.price = f.priceRange;
    if (f.sort) queryParams.sort = f.sort;
    if (f.status) queryParams.status = f.status;

    queryParams.page = this.pagination().page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  // ===== ACTIONS =====
  updateFilter(newFilter: Partial<ShopFilter>) {
    this.filters.update(current => ({ ...current, ...newFilter }));
    this.setPage(1);        // Reset về trang 1 khi lọc
    this.updateURL();
  }

  setPage(page: number) {
    this.pagination.update(p => ({ ...p, page }));
    this.updateURL();
  }

  resetFilters() {
    this.filters.set({});
    this.pagination.update(p => ({ ...p, page: 1 }));
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  // ===== GETTERS =====
  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}
