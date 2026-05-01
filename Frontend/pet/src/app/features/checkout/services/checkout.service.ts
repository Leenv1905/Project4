import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';

// CheckoutService  → build order + validate

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private orderService = inject(OrderService);

  // ✅ build order (for local preview/fallback)
  buildOrder(form: any, items: any[], total: number): Order {
    return {
      id: Date.now(),
      items,
      totalAmount: total,
      status: 'pending',
      createdAt: new Date(),

      customerName: form.customerName,
      phone: form.phone,
      address: form.address,
      note: form.note
    };
  }

  // ✅ place order via backend checkout API
  placeOrder(form: {
    addressId?: number | null;
    customerName: string;
    phone: string;
    address: string;
    note?: string;
    paymentMethod?: string;
  }): Observable<Order | null> {
    return this.orderService.checkout(form).pipe(
      map((createdOrders) => {
        if (!createdOrders || createdOrders.length === 0) {
          return null;
        }
        return createdOrders[0];
      })
    );
  }
  // ✅ create VNPay URL
  createVNPayUrl(orderId: number): Observable<any> {
    return this.orderService.createVNPayUrl(orderId);
  }
}
