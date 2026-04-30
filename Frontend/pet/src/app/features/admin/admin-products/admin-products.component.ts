import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Product} from '../../../core/models/product.model';
import {PetApiService} from '../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  private readonly petApi = inject(PetApiService);

  readonly router = inject(Router);
  readonly allProducts = signal<Product[]>([]);
  readonly searchText = signal('');
  readonly selectedSpecies = signal('');
  readonly selectedStatus = signal('');
  readonly selectedShop = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(15);
  readonly isLoading = signal(false);

  readonly availableShops = computed(() => {
    const shops = new Set(this.allProducts().map((product) => product.shopName));
    return Array.from(shops).sort();
  });

  readonly filteredProducts = computed(() => {
    let result = [...this.allProducts()];

    const term = this.searchText().toLowerCase().trim();
    if (term) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(term) ||
        product.breed.toLowerCase().includes(term)
      );
    }

    if (this.selectedSpecies()) {
      result = result.filter((product) => product.species === this.selectedSpecies());
    }

    if (this.selectedStatus()) {
      result = result.filter((product) => product.status === this.selectedStatus());
    }

    if (this.selectedShop()) {
      result = result.filter((product) => product.shopName === this.selectedShop());
    }

    return result;
  });

  readonly paginatedProducts = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  readonly total = computed(() => this.filteredProducts().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.petApi.listAllPets().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        this.isLoading.set(false);
      },
      error: () => {
        this.allProducts.set([]);
        this.isLoading.set(false);
      }
    });
  }

  toggleBlock(_productId: number) {
    alert('Backend hien chua co endpoint block/unblock san pham.');
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Còn hàng';
      case 'sold':
        return 'Đã bán';
      case 'reserved':
        return 'Đặt trước';
      case 'not_for_sale':
        return 'Đã block';
      default:
        return status;
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((page) => page + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update((page) => page - 1);
    }
  }

  changePageSize(size: number) {
    this.pageSize.set(Number(size));
    this.page.set(1);
  }

  protected readonly Math = Math;
}
