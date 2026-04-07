import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-my-shop-dashboard',
  imports: [CommonModule],
  templateUrl: './my-shop-dashboard.component.html',
  styleUrls: ['./my-shop-dashboard.component.scss']
})
export class MyShopDashboardComponent {

  stats = [
    {
      title: 'Revenue',
      value: '$12,540',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Orders',
      value: '324',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Products',
      value: '48',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Views',
      value: '18k',
      change: '-4%',
      trend: 'down'
    }
  ];

  topProducts = [
    {
      name: 'Poodle Toy',
      sales: 120,
      revenue: '$3,200'
    },
    {
      name: 'Golden Retriever',
      sales: 98,
      revenue: '$2,900'
    },
    {
      name: 'Pug Puppy',
      sales: 75,
      revenue: '$2,100'
    }
  ];

}
