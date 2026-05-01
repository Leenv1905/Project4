import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CartItem } from '../models/cart-item.model';
import { environment } from '../../../environments/environment';

interface BackendCartItem {
  id: number;
  petId: number;
  petName: string;
  petImage: string;
  price: number;
  quantity: number;
}

interface BackendCartResponse {
  id: number;
  userId: number;
  items: BackendCartItem[];
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/cart`;

  private _items = signal<CartItem[]>([]);
  items = this._items.asReadonly();

  total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  );

  itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

  constructor() {
    // ưu tiên load từ API; localStorage chỉ fallback
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        this._items.set(JSON.parse(saved));
      } catch {
        this._items.set([]);
      }
    }
    this.loadCart().subscribe();
  }

  private saveLocal() {
    localStorage.setItem('cart', JSON.stringify(this._items()));
  }

  private mapBackendItemToCartItem(item: BackendCartItem): CartItem {
    return {
      cartItemId: Number(item.id),
      productId: Number(item.petId),
      name: item.petName || 'Pet',
      image: item.petImage || '',
      price: Number(item.price || 0),
      shopName: '',
      quantity: Number(item.quantity || 1)
    };
  }

  private syncFromBackend(response: BackendCartResponse | null) {
    const mapped = (response?.items || []).map((i) => this.mapBackendItemToCartItem(i));
    this._items.set(mapped);
    this.saveLocal();
  }

  loadCart(): Observable<CartItem[]> {
    return this.http.get<BackendCartResponse>(this.apiUrl, { withCredentials: true }).pipe(
      tap((res) => this.syncFromBackend(res)),
      map((res) => (res?.items || []).map((i) => this.mapBackendItemToCartItem(i))),
      catchError(() => {
        return of(this._items());
      })
    );
  }

  addToCart(newItem: CartItem): Observable<{ success: boolean; message: string }> {
    const payload = {
      petId: newItem.productId,
      quantity: newItem.quantity || 1
    };

    return this.http.post<any>(`${this.apiUrl}/add`, payload, { withCredentials: true }).pipe(
      tap(() => {
        this.loadCart().subscribe();
      }),
      map(() => ({
        success: true,
        message: 'Đã thêm sản phẩm vào giỏ hàng'
      })),
      catchError((err) => {
        const message =
          err?.error?.message ||
          err?.error ||
          'Không thể thêm vào giỏ hàng';
        return of({
          success: false,
          message
        });
      })
    );
  }

  removeItem(productId: number) {
    const current = this._items();
    const target = current.find((i) => i.productId === productId);

    if (!target?.cartItemId) return;

    // Optimistic update: xóa khỏi signal ngay để UI cập nhật liền
    this._items.set(current.filter((i) => i.productId !== productId));
    this.saveLocal();

    this.http.delete(`${this.apiUrl}/${target.cartItemId}`, { withCredentials: true }).pipe(
      catchError(() => {
        // Rollback nếu server lỗi
        this.loadCart().subscribe();
        return of(null);
      })
    ).subscribe();
  }

  clearCart() {
    const items = [...this._items()];
    if (items.length === 0) return;

    // best-effort clear: remove từng item trên server nếu có thể
    items.forEach((item) => {
      this.removeItem(item.productId);
    });

    this._items.set([]);
    this.saveLocal();
  }
}
