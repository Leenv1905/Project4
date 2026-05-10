import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../../core/models/product.model';
import { PetApiService } from '../../../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-my-shop-products',
  imports: [CommonModule],
  templateUrl: './my-shop-products.component.html',
  styleUrls: ['./my-shop-products.component.scss'],
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
      },
    });
  }

  // ==================== CLICK OUTSIDE TO CLOSE MENU ====================
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Nếu click không phải vào nút ⋮ và không phải vào dropdown thì đóng menu
    if (!target.closest('.dots') && !target.closest('.dropdown')) {
      this.openMenu = null;
    }
  }

  toggleMenu(id: number) {
    // Ngăn event lan ra document
    event?.stopImmediatePropagation();

    if (this.openMenu === id) {
      this.openMenu = null;
    } else {
      this.openMenu = id;
    }
  }

  // ==================== OTHER METHODS ====================
  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      available: 'Available',
      sold: 'Sold',
      pending: 'Pending',
      reserved: 'Reserved',
      not_for_sale: 'Not for Sale',
    };
    return map[status] || status;
  }

  addProduct() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'add-product' },
    });
  }

  editProduct(id: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: 'edit-product', id },
    });
  }

  openView(product: Product) {
    this.selectedProduct = product;
    this.openMenu = null;
  }

  closeView() {
    this.selectedProduct = null;
  }

  openDelete(product: Product) {
    this.deleteProduct = product;
    this.openMenu = null;
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
        this.products = this.products.filter((p) => p.id !== idToRemove);
        this.deleteProduct = null;
        this.showSuccessModal = true;
      },
      error: () => {
        alert('Error deleting product. Please try again.');
      },
    });
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage() {
    if (this.page > 1) this.page--;
  }

  changePageSize(size: number) {
    this.pageSize = Number(size);
    this.page = 1;
  }

  protected readonly Math = Math;
}
