import { Injectable, inject } from '@angular/core';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
// CheckoutService  → build order + validate

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private orderService = inject(OrderService);

  // ✅ build order
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

  // ✅ place order (orchestrator)
  placeOrder(order: Order) {

    // 👉 sau này gọi API ở đây
    // await http.post('/orders')

    this.orderService.createOrder(order);

    return order;
  }

}
