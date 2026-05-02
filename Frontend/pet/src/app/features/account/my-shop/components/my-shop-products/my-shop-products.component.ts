import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../../../core/models/product.model';
import {PetApiService} from '../../../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-my-shop-products',
  imports: [CommonModule],
  templateUrl: './my-shop-products.component.html',
  styleUrls: ['./my-shop-products.component.scss']
})
export class MyShopProductsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly petApi = inject(PetApiService);

  products: Product[] = [];
  selectedProduct: Product | null = null;
  deleteProduct: Product | null = null;
  openMenu: number | null = null;
  isLoading = false;
  showSuccessModal = false;
  page = 1;
  pageSize = 10;
  imageUrl?: string;

  ngOnInit() {
    this.loadProducts();
  }

  get total() {
    return this.products.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get paginatedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  loadProducts() {
    this.isLoading = true;
    this.petApi.listMyPets().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: () => {
        this.products = [];
        this.isLoading = false;
      }
    });
  }
  notification = {
    show: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  };
  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      available: 'Còn hàng',
      sold: 'Đã bán',
      pending: 'Chờ duyệt',
      reserved: 'Đặt trước',
      not_for_sale: 'Ngừng bán'
    };
    return map[status] || status;
  }

  addProduct() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: 'add-product'}
    });
  }

  editProduct(id: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: 'edit-product', id}
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
    if (!this.deleteProduct) return;

    const idToRemove = this.deleteProduct.id;
    const petName = this.deleteProduct.name;

    this.petApi.deletePet(idToRemove).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== idToRemove);
        this.deleteProduct = null; // Đóng modal xác nhận cũ

        // Hiển thị modal thành công bằng component mới
        this.showNotification(
          'Thành công',
          `Đã xóa thú cưng ${petName} khỏi hệ thống.`,
          'success'
        );
      },
      error: () => {
        this.showNotification(
          'Lỗi',
          'Không thể xóa sản phẩm. Vui lòng thử lại sau.',
          'error'
        );
      }
    });
  }

  showNotification(title: string, message: string, type: 'success' | 'error' | 'info') {
    this.notification = { show: true, title, message, type };
  }

  toggleMenu(id: number) {
    this.openMenu = this.openMenu === id ? null : id;
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  changePageSize(size: number) {
    this.pageSize = Number(size);
    this.page = 1;
  }

  protected readonly Math = Math;
}
