import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderAction } from '../config/order-action.type';
import { ORDER_ACTIONS } from '../config/order-action.config';
import { environment } from '../../../environments/environment';

export interface CheckoutRequestPayload {
  addressId?: number | null;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/v1/orders`;

  private _orders = signal<Order[]>([]);
  orders = this._orders.asReadonly();

  constructor() {
    const saved = localStorage.getItem('orders');
    if (saved) {
      this._orders.set(JSON.parse(saved));
    }
  }

  private save() {
    localStorage.setItem('orders', JSON.stringify(this._orders()));
  }

  private mapApiOrderToOrderModel(apiOrder: any): Order {
    return {
      id: Number(apiOrder?.id ?? Date.now()),
      items: (apiOrder?.items || []).map((i: any) => ({
        productId: i?.petId || i?.productId || 0,
        name: i?.petName || i?.name || 'Pet',
        price: Number(i?.unitPrice || i?.price || 0),
        quantity: Number(i?.quantity || 1),
        image: i?.petImage || i?.image || ''
      })),
      totalAmount: Number(apiOrder?.totalAmount || 0),
      status: (apiOrder?.status || 'pending').toLowerCase() as any,
      fulfillmentStatus: (apiOrder?.fulfillmentStatus || '').toLowerCase() || undefined,
      paymentMethod: apiOrder?.paymentMethod || undefined,
      paymentStatus: apiOrder?.paymentStatus || undefined,
      createdAt: apiOrder?.createdAt ? new Date(apiOrder.createdAt) : new Date(),
      customerName: apiOrder?.customerName || '',
      phone: apiOrder?.phone || '',
      address: apiOrder?.address || '',
      note: apiOrder?.note || ''
    };
  }

  checkout(payload: CheckoutRequestPayload): Observable<Order[]> {
    return this.http.post<any[]>(`${this.apiUrl}/checkout`, payload, { withCredentials: true }).pipe(
      tap((apiOrders) => {
        const mapped = (apiOrders || []).map((o) => this.mapApiOrderToOrderModel(o));
        this._orders.update((prev) => [...mapped, ...prev]);
        this.save();
      })
    );
  }

  createVNPayUrl(orderId: number): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/api/v1/payments/vnpay/create-url?orderId=${orderId}`, {}, { withCredentials: true });
  }

  loadMyOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`, { withCredentials: true }).pipe(
      tap((apiOrders) => {
        const mapped = (apiOrders || []).map((o) => this.mapApiOrderToOrderModel(o));
        this._orders.set(mapped);
        this.save();
      })
    );
  }

  loadShopOrders(): Observable<Order[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/v1/shop/orders`, { withCredentials: true }).pipe(
      tap((apiOrders) => {
        const mapped = (apiOrders || []).map((o) => this.mapApiOrderToOrderModel(o));
        this._orders.set(mapped);
        this.save();
      })
    );
  }

  updateShopOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${environment.apiBaseUrl}/api/v1/shop/orders/${orderId}/status`, { status }, { withCredentials: true });
  }

  createOrder(order: Order) {
    this._orders.update((list) => [...list, order]);
    this.save();
  }

  getById(id: number) {
    return () => this._orders().find((o) => o.id === id);
  }

  performAction(id: number, action: OrderAction) {
    const config = ORDER_ACTIONS[action];

    this._orders.update((list) =>
      list.map((order) => {
        if (order.id !== id) return order;

        if (!config.canExecute(order)) {
          console.warn('❌ Invalid action:', action, order);
          return order;
        }

        const updated = config.execute(order);
        console.log('✅ Action:', action, updated);
        return updated;
      })
    );

    this.save();
  }

  clear() {
    this._orders.set([]);
    localStorage.removeItem('orders');
  }
}
