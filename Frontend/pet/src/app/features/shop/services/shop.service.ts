import { Injectable, signal, computed, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

import { ShopFilter } from '../models/shop-filter.model';
import { PaginationState } from '../models/pagination.model';
import { Product } from '../../../core/models/product.model';

interface PetPublicApi {
  id: number;
  petCode?: string;
  name?: string;
  species?: string;
  breed?: string;
  price?: number;
  imageUrl?: string;
  status?: 'available' | 'sold' | 'reserved' | 'not_for_sale';
  gender?: 'male' | 'female';
  color?: string;
  weight?: number;
  age?: number;
  shopId?: number;
  shopName?: string;
  isVerified?: boolean;
  trustScore?: number;
  isHealthVerified?: boolean;
  isPedigreeVerified?: boolean;
  createdAt?: string;
  matchScore?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/pets/public`;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
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

    this.loadPublicPets();
  }

  private products = signal<Product[]>([]);

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

  filteredProducts = computed(() => {
    let result = [...this.products()];
    const f = this.filters();

    if (f.searchQuery) {
      const q = f.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q)
      );
    }

    if (f.breed) {
      result = result.filter(p => p.breed === f.breed);
    }

    if (f.species) {
      result = result.filter(p => p.species === f.species);
    }

    if (f.color) {
      result = result.filter(p => p.color === f.color);
    }

    if (f.weightRange) {
      if (f.weightRange === 'light') result = result.filter(p => p.weight < 5);
      else if (f.weightRange === 'medium') result = result.filter(p => p.weight >= 5 && p.weight <= 15);
      else if (f.weightRange === 'heavy') result = result.filter(p => p.weight > 15);
    }

    if (f.status) {
      result = result.filter(p => p.status === f.status);
    }

    if (f.gender) {
      result = result.filter(p => p.gender === f.gender);
    }

    if (f.priceRange) {
      if (f.priceRange === 'low') result = result.filter(p => p.price < 5000000);
      else if (f.priceRange === 'medium') result = result.filter(p => p.price >= 5000000 && p.price <= 10000000);
      else if (f.priceRange === 'high') result = result.filter(p => p.price > 10000000);
    }

    if (f.sort) {
      result.sort((a, b) => {
        switch (f.sort) {
          case 'priceAsc': return a.price - b.price;
          case 'priceDesc': return b.price - a.price;
          case 'nameAsc': return a.name.localeCompare(b.name);
          case 'nameDesc': return b.name.localeCompare(a.name);
          case 'newest': return (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0);
          default: return 0;
        }
      });
    }

    return result;
  });

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

  private mapApiToProduct(item: PetPublicApi): Product {
    return {
      id: Number(item.id),
      petCode: item.petCode,
      name: item.name || 'Pet',
      description: '',
      price: Number(item.price || 0),
      images: item.imageUrl ? [item.imageUrl] : [],
      status: ((item.status?.toLowerCase() || 'available') as Product['status']),
      species: (item.species === 'Chó' || item.species === 'Mèo' ? item.species : 'Khác'),
      breed: item.breed || '',
      color: item.color || '',
      gender: item.gender || 'male',
      weight: Number(item.weight || 0),
      age: item.age,
      vaccinated: Boolean(item.isHealthVerified),
      neutered: false,
      shopId: Number(item.shopId || 0),
      shopName: item.shopName || 'Pet Shop',
      createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      isVerified: item.isVerified,
      trustScore: item.trustScore,
      isHealthVerified: item.isHealthVerified,
      isPedigreeVerified: item.isPedigreeVerified
    };
  }

  loadPublicPets() {
    this.http.get<PetPublicApi[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.products.set((res || []).map((i) => this.mapApiToProduct(i)));
      },
      error: () => {
        this.products.set([]);
      }
    });
  }

  getPublicPets(): Observable<Product[]> {
    return this.http.get<PetPublicApi[]>(this.apiUrl).pipe(
      map(res => (res || []).map(i => this.mapApiToProduct(i)))
    );
  }

  getRecommendedPets(): Observable<Product[]> {
    return this.http.get<PetPublicApi[]>(`${environment.apiBaseUrl}/api/v1/pets/recommendations`, { withCredentials: true }).pipe(
      map(res => (res || []).map(i => this.mapApiToProduct(i)))
    );
  }


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

  updateFilter(newFilter: Partial<ShopFilter>) {
    this.filters.update(current => ({ ...current, ...newFilter }));
    this.setPage(1);
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

  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}
