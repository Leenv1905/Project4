import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {

    // Load từ localStorage
    const saved = localStorage.getItem('cart');
    if (saved) {
      this._items.set(JSON.parse(saved));
    }

    // Lưu mỗi khi cart thay đổi
    effect(() => {
      localStorage.setItem('cart', JSON.stringify(this._items()));
    });

  }

  private _items = signal<CartItem[]>([]);

  items = this._items;

  total = computed(() =>
    this._items().reduce((sum, i) => sum + i.price * i.quantity, 0)
  );

  totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  // ===== ADD =====
  addToCart(item: CartItem) {

    this._items.update(items => {

      const existing = items.find(i => i.productId === item.productId);

      if (existing) {
        return items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...items, item];
    });
    alert('Đã thêm vào giỏ hàng');
    console.log('Cart:', this._items());
  }

  // ===== REMOVE =====
  removeItem(productId: number) {
    this._items.update(items =>
      items.filter(i => i.productId !== productId)
    );
  }

  // ===== UPDATE =====
  updateQuantity(productId: number, quantity: number) {

    if (quantity <= 0) return;

    this._items.update(items =>
      items.map(i =>
        i.productId === productId
          ? { ...i, quantity }
          : i
      )
    );
  }

  // ===== CLEAR =====
  clearCart() {
    this._items.set([]);
  }

}
