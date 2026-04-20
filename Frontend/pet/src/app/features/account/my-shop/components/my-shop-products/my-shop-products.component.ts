import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {Product} from '../../../../../core/models/product.model';
import {generateMockProducts} from '../../../../shop/data/mock-products'; // Sử dụng hàm generate để có nhiều dữ liệu

@Component({
  standalone: true,
  selector: 'app-my-shop-products',
  imports: [CommonModule],
  templateUrl: './my-shop-products.component.html',
  styleUrls: ['./my-shop-products.component.scss']
})
export class MyShopProductsComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);

  // Sử dụng mock data mới với hàm generate
  products: Product[] = generateMockProducts(25);   // Tạo 25 sản phẩm

  selectedProduct: Product | null = null;
  deleteProduct: Product | null = null;
  openMenu: number | null = null;

  // Pagination
  page = 1;
  pageSize = 10;

  get total() {
    return this.products.length;
  }

  get totalPages() {
    return Math.ceil(this.total / this.pageSize);
  }

  get paginatedProducts() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.products.slice(start, end);
  }

  // ==================== ACTIONS ====================

  addProduct() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'add-product' }
    });
  }

  editProduct(id: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'edit-product', id: id }
    });
  }

  openView(product: Product) {
    this.selectedProduct = product;
  }

  closeView() {
    this.selectedProduct = null;
  }

  openDelete(product: Product) {
    this.deleteProduct = product;
  }

  closeDelete() {
    this.deleteProduct = null;
  }

  confirmDelete() {
    if (this.deleteProduct) {
      this.products = this.products.filter(p => p.id !== this.deleteProduct!.id);
      this.deleteProduct = null;
      alert('Đã xóa sản phẩm thành công!');
    }
  }

  toggleMenu(id: number) {
    this.openMenu = this.openMenu === id ? null : id;
  }

  // Pagination methods
  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  changePageSize(size: number) {
    this.pageSize = size;
    this.page = 1;
  }

  protected readonly Math = Math;
}
