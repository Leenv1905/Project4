import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MOCK_ORDERS } from '../../components/account-orders/mock-orders';
import { AccountOrderTimelineComponent } from '../../components/account-order-timeline/account-order-timeline.component';

@Component({
  standalone: true,
  selector: 'app-order-detail',
  imports: [CommonModule, AccountOrderTimelineComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {

  route = inject(ActivatedRoute);

  order = signal<any>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const found = MOCK_ORDERS.find(o => o.id === id);

    if (found) {
      this.order.set(found);
    }
  }

}
