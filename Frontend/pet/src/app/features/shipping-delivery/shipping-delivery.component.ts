import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/home-components/for-features/breadcrumbs/breadcrumbs.component';

@Component({
  standalone: true,
  selector: 'app-shipping-delivery',
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './shipping-delivery.component.html',
  styleUrls: ['./shipping-delivery.component.scss']
})
export class ShippingDeliveryComponent {}
