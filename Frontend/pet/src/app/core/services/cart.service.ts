import { Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../../shared/models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // ===== STATE =====
  private _items = signal<CartItem[]>([]);

  // ===== READONLY STATE (giống useCart()) =====
  items = this._items.asReadonly();

  // ===== COMPUTED =====
  totalQuantity = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  // ===== ACTIONS =====
  addToCart(item: CartItem) {
    const current = this._items();
    const existing = current.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity += item.quantity;
      this._items.set([...current]);
    } else {
      this._items.set([...current, { ...item }]);
    }
  }

  removeFromCart(productId: number) {
    this._items.set(
      this._items().filter(item => item.productId !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updated = this._items().map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );

    this._items.set(updated);
  }

  clearCart() {
    this._items.set([]);
  }
}
