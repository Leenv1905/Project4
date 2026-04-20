import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { generateMockProducts } from '../../shop/data/mock-products';
import {FormsModule} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent {

  router = inject(Router);

  allProducts = generateMockProducts(40);

  // ==================== FILTER STATES ====================
  searchText = signal('');
  selectedSpecies = signal('');
  selectedStatus = signal('');
  selectedShop = signal('');

  // Danh sách Shop unique
  availableShops = computed(() => {
    const shops = new Set(this.allProducts.map(p => p.shopName));
    return Array.from(shops).sort();
  });

  // ==================== FILTERED PRODUCTS ====================
  filteredProducts = computed(() => {
    let result = [...this.allProducts];

    // Tìm kiếm theo tên hoặc giống
    const term = this.searchText().toLowerCase().trim();
    if (term) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.breed.toLowerCase().includes(term)
      );
    }

    // Lọc theo loài
    if (this.selectedSpecies()) {
      result = result.filter(p => p.species === this.selectedSpecies());
    }

    // Lọc theo trạng thái
    if (this.selectedStatus()) {
      result = result.filter(p => p.status === this.selectedStatus());
    }

    // Lọc theo Shop
    if (this.selectedShop()) {
      result = result.filter(p => p.shopName === this.selectedShop());
    }

    return result;
  });

  // ==================== PAGINATION ====================
  page = signal(1);
  pageSize = signal(15);

  paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  total = computed(() => this.filteredProducts().length);
  totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  // ==================== BLOCK / UNBLOCK ====================
  toggleBlock(productId: number) {
    const product = this.allProducts.find(p => p.id === productId);
    if (!product) return;

    if (product.status === 'not_for_sale') {
      product.status = 'available';
      alert(`Đã gỡ block sản phẩm #${productId}`);
    } else {
      product.status = 'not_for_sale';
      alert(`Đã block sản phẩm #${productId}`);
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available': return 'Còn hàng';
      case 'sold': return 'Đã bán';
      case 'reserved': return 'Đặt trước';
      case 'not_for_sale': return 'Đã block';
      default: return status;
    }
  }

  // Pagination methods
  nextPage() {
    if (this.page() < this.totalPages()) this.page.update(p => p + 1);
  }

  prevPage() {
    if (this.page() > 1) this.page.update(p => p - 1);
  }

  changePageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1);
  }

  protected readonly Math = Math;
}

// import { Component, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
//
// import { Product } from '../../../core/models/product.model';
// import { generateMockProducts } from '../../shop/data/mock-products';
//
// @Component({
//   standalone: true,
//   selector: 'app-admin-products',
//   imports: [CommonModule],
//   templateUrl: './admin-products.component.html',
//   styleUrls: ['./admin-products.component.scss']
// })
// export class AdminProductsComponent {
//
//   router = inject(Router);
//
//   products: Product[] = generateMockProducts(35);
//
//   // Lưu trạng thái trước khi block (key = productId)
//   private previousStatus = new Map<number, Product['status']>();
//
//   // Phân trang
//   page = 1;
//   pageSize = 15;
//
//   get total() { return this.products.length; }
//   get totalPages() { return Math.ceil(this.total / this.pageSize); }
//
//   get paginatedProducts() {
//     const start = (this.page - 1) * this.pageSize;
//     return this.products.slice(start, start + this.pageSize);
//   }
//
//   // ==================== BLOCK / UNBLOCK LOGIC ====================
//   toggleBlock(productId: number) {
//     const product = this.products.find(p => p.id === productId);
//     if (!product) return;
//
//     if (product.status === 'not_for_sale') {
//       // === GỠ BLOCK ===
//       const oldStatus = this.previousStatus.get(productId) || 'available';
//       product.status = oldStatus;
//       this.previousStatus.delete(productId);   // Xóa khỏi bộ nhớ tạm
//
//       alert(`Đã gỡ block sản phẩm #${productId}. Trạng thái cũ: ${this.getStatusLabel(oldStatus)}`);
//     } else {
//       // === BLOCK ===
//       this.previousStatus.set(productId, product.status);  // Lưu trạng thái cũ
//       product.status = 'not_for_sale';
//
//       alert(`Đã block sản phẩm #${productId}`);
//     }
//   }
//
//   getStatusLabel(status: string): string {
//     switch (status) {
//       case 'available': return 'Còn hàng';
//       case 'sold': return 'Đã bán';
//       case 'reserved': return 'Đặt trước';
//       case 'not_for_sale': return 'Đã block';
//       default: return status;
//     }
//   }
//
//   // Pagination ...
//   nextPage() { if (this.page < this.totalPages) this.page++; }
//   prevPage() { if (this.page > 1) this.page--; }
//   changePageSize(size: number) {
//     this.pageSize = size;
//     this.page = 1;
//   }
//
//   protected readonly Math = Math;
// }
