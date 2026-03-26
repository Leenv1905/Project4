import { Injectable, signal } from '@angular/core';
import { Order } from '../../../core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  currentOrder = signal<Order | null>(null);

  placeOrder(order: Order) {

    // mock call API
    console.log('Order placed:', order);

    this.currentOrder.set(order);

    return true;
  }

}
