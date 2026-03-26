import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../../../core/models/order.model';

@Component({
  standalone: true,
  selector: 'app-order-timeline',
  imports: [CommonModule],
  templateUrl: './account-order-timeline.component.html',
  styleUrls: ['./account-order-timeline.component.scss']
})
export class AccountOrderTimelineComponent {

  @Input() status!: OrderStatus;

  steps = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Shop xác nhận' },
    { key: 'shipping', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã nhận' }
  ];

  isActive(step: string) {
    const order = ['pending', 'confirmed', 'shipping', 'delivered'];

    return order.indexOf(step) <= order.indexOf(this.status);
  }

  isCancelled() {
    return this.status === 'cancelled';
  }

}
