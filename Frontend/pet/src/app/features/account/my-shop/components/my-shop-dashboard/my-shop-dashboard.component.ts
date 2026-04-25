import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../../core/services/order.service';
import { PetApiService } from '../../../../../core/services/pet-api.service';

@Component({
  standalone: true,
  selector: 'app-my-shop-dashboard',
  imports: [CommonModule],
  templateUrl: './my-shop-dashboard.component.html',
  styleUrls: ['./my-shop-dashboard.component.scss']
})
export class MyShopDashboardComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly petApi = inject(PetApiService);

  readonly productsCount = signal(0);
  readonly topProducts = signal<Array<{ name: string; sales: number; revenue: string }>>([]);

  readonly stats = computed(() => {
    const orders = this.orderService.orders();
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrder = orders.length > 0 ? revenue / orders.length : 0;

    return [
      {
        title: 'Revenue',
        value: this.formatCurrency(revenue),
        change: `${orders.length} orders`,
        trend: 'up'
      },
      {
        title: 'Orders',
        value: String(orders.length),
        change: 'From API',
        trend: 'up'
      },
      {
        title: 'Products',
        value: String(this.productsCount()),
        change: 'My listings',
        trend: 'up'
      },
      {
        title: 'Avg Order',
        value: this.formatCurrency(avgOrder),
        change: 'Per order',
        trend: 'up'
      }
    ];
  });

  ngOnInit() {
    this.orderService.loadShopOrders().subscribe({
      next: () => this.buildTopProducts()
    });

    this.petApi.listMyPets().subscribe({
      next: (products) => {
        this.productsCount.set(products.length);
      }
    });
  }

  private buildTopProducts() {
    const aggregated = new Map<string, { sales: number; revenue: number }>();

    this.orderService.orders().forEach((order) => {
      order.items.forEach((item) => {
        const current = aggregated.get(item.name) || { sales: 0, revenue: 0 };
        current.sales += item.quantity;
        current.revenue += item.price * item.quantity;
        aggregated.set(item.name, current);
      });
    });

    this.topProducts.set(
      Array.from(aggregated.entries())
        .map(([name, value]) => ({
          name,
          sales: value.sales,
          revenue: this.formatCurrency(value.revenue)
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
    );
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value || 0);
  }
}
