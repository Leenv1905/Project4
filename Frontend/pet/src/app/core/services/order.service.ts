import { Injectable, signal, computed, effect } from '@angular/core';
import {Order} from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _orders = signal<Order[]>([]);

  orders = this._orders;

  // ===== FILTER =====
  getOrdersByStatus(status: string) {
    return computed(() =>
      this._orders().filter(o => o.status === status)
    );
  }

  // ===== CREATE ORDER =====
  createOrder(order: Order) {
    this._orders.update(list => [order, ...list]);
  }

  // ===== UPDATE STATUS =====
  updateStatus(id: number, status: Order['status']) {

    this._orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, status } : o
      )
    );

  }

  // ===== GET BY ID =====
  getById(id: number) {
    return computed(() =>
      this._orders().find(o => o.id === id)
    );
  }
  clear() {
    this._orders.set([]);
    localStorage.removeItem('orders');
  }
  // ===== LOCAL STORAGE =====
  constructor() {

    const saved = localStorage.getItem('orders');
    if (saved) {
      this._orders.set(JSON.parse(saved));
    }

    effect(() => {
      localStorage.setItem('orders', JSON.stringify(this._orders()));
    });

  }

}
