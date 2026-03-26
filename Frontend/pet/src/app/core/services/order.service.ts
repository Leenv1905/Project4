import { Injectable, signal, computed, effect } from '@angular/core';
import {FulfillmentStatus, Order, OrderStatus} from '../models/order.model';

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
  // updateStatus(id: number, status: Order['status']) {
  //
  //   this._orders.update(list =>
  //     list.map(o =>
  //       o.id === id ? { ...o, status } : o
  //     )
  //   );
  //
  // }
  // Khi shop confirm
  updateStatus(id: number, status: OrderStatus) {

    this._orders.update(list =>
      list.map(o => {

        if (o.id !== id) return o;

        if (status === 'confirmed') {
          return {
            ...o,
            status,
            fulfillmentStatus: 'pending' // Trạng thái bên operator bắt đầu từ pending
          };
        }

        return { ...o, status };

      })
    );

  }

  // ===== GET BY ID =====
  getById(id: number) {
    return computed(() =>
      this._orders().find(o => o.id === id)
    );
  }
  // clear() {
  //   this._orders.set([]);
  //   localStorage.removeItem('orders');
  // }

  updateFulfillmentStatus(id: number, status: FulfillmentStatus) {
    this._orders.update(list =>
      list.map(o =>
        o.id === id ? { ...o, fulfillmentStatus: status } : o
      )
    );
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

  // AUTO FALLBACK NẾU THIẾU FIELD
  // constructor() {
  //   const saved = localStorage.getItem('orders');
  //
  //   if (saved) {
  //     const parsed = JSON.parse(saved).map((o: any) => ({
  //       ...o,
  //       fulfillmentStatus: o.fulfillmentStatus || undefined
  //     }));
  //
  //     this._orders.set(parsed);
  //   }
  //   console.log('Operator Orders:', this.orders());
  // }

}
