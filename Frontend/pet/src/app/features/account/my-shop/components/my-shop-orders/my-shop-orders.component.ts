import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { OrderService } from '../../../../../core/services/order.service';
import { ORDER_STATUS_CONFIG } from '../../../../../core/constants/order-status.constant';
import { OrderStatus } from '../../../../../core/models/order.model';
import { getStatusLabel } from '../../../../../core/utils/order-status.util';

@Component({
  standalone: true,
  selector: 'app-my-shop-orders',
  imports: [CommonModule],
  templateUrl: './my-shop-orders.component.html',
  styleUrls: ['./my-shop-orders.component.scss']
})
export class MyShopOrdersComponent {

  router = inject(Router);
  route = inject(ActivatedRoute);
  orderService = inject(OrderService);

  orders = this.orderService.orders;

  statuses = ORDER_STATUS_CONFIG;

  getStatusLabel = getStatusLabel;

  activeTab = signal<OrderStatus | 'all'>('all');

  page = signal(1);

  pageSize = signal(10);

  total = computed(() => this.filteredOrders().length);

  filteredOrders = computed(() => {
    if (this.activeTab() === 'all') return this.orders();
    return this.orders().filter(o => o.status === this.activeTab());
  });

  count(status: OrderStatus) {
    return this.orders().filter(o => o.status === status).length;
  }

  confirmOrder(id: number) {
    this.orderService.performAction(id, 'shop_confirm');
  }

  confirmReturn(id: number) {
    this.orderService.performAction(id, 'shop_confirm_return');
  }

  viewOrder(id:number){

    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{
        tab:'order-detail',
        id:id
      }
    });

  }

  rejectOrder(id: number) {
    this.orderService.performAction(id, 'shop_confirm');
  }

  getStatusClass(status: OrderStatus) {

    switch (status) {

      case 'pending':
        return 'pending';

      case 'confirmed':
        return 'confirmed';

      case 'shipping':
        return 'shipping';

      case 'completed':
        return 'completed';

      case 'cancelled':
        return 'cancelled';

      default:
        return '';

    }

  }
// PAGINATION
  paginatedOrders = computed(() => {

    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.filteredOrders().slice(start, end);

  });

  totalPages = computed(() =>

    Math.ceil(this.total() / this.pageSize())

  );
  nextPage() {

    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
    }

  }

  prevPage() {

    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }

  }

  changePageSize(size: number) {

    this.pageSize.set(size);
    this.page.set(1);

  }

  protected readonly Math = Math;
}


// import { Component, signal, computed, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
//
// import { OrderService } from '../../../../../core/services/order.service';
// import { ORDER_STATUS_CONFIG } from '../../../../../core/constants/order-status.constant';
// import { OrderStatus } from '../../../../../core/models/order.model';
// import { getStatusLabel } from '../../../../../core/utils/order-status.util';
//
// @Component({
//   standalone: true,
//   selector: 'app-my-shop-orders',
//   imports: [CommonModule],
//   templateUrl: './my-shop-orders.component.html',
//   styleUrls: ['./my-shop-orders.component.scss']
// })
// export class MyShopOrdersComponent {
//
//   orderService = inject(OrderService);
//
//   orders = this.orderService.orders;
//   statuses = ORDER_STATUS_CONFIG;
//   getStatusLabel = getStatusLabel;
//
//   activeTab = signal<OrderStatus | 'all'>('pending');
//
//   filteredOrders = computed(() => {
//     if (this.activeTab() === 'all') return this.orders();
//     return this.orders().filter(o => o.status === this.activeTab());
//   });
//
//   count(status: OrderStatus) {
//     return this.orders().filter(o => o.status === status).length;
//   }
//
//   confirmOrder(id: number) {
//     this.orderService.performAction(id, 'shop_confirm');
//   }
//   confirmReturn(id: number) {
//     this.orderService.performAction(id, 'shop_confirm_return');
//   }
//   rejectOrder(id: number) {
//     this.orderService.performAction(id, 'shop_confirm');
//   }
//
// }
