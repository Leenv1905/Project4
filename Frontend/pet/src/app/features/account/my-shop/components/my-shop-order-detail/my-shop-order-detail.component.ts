import {Component, inject, computed, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../../../../../core/services/order.service';
import { getStatusLabel } from '../../../../../core/utils/order-status.util';

@Component({
  standalone:true,
  selector:'app-my-shop-order-detail',
  imports:[CommonModule],
  templateUrl:'./my-shop-order-detail.component.html',
  styleUrls:['./my-shop-order-detail.component.scss']
})
export class MyShopOrderDetailComponent {

  orderService = inject(OrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  orders = this.orderService.orders;

  orderId = signal<number | null >(null);
  ngOnInit(){

    this.route.queryParams.subscribe(params => {
      this.orderId.set(Number(params['id'] ));
    });

  }
  order = computed(() => {
    if(this.orderId() === null) return null;
    return this.orders().find(o => o.id === this.orderId());
  });

  getStatusLabel = getStatusLabel;

  back(){

    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{tab:'orders'}
    });

  }

}
