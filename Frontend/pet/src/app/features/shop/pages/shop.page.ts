import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListComponent } from '../components/product-list/product-list.component';
import { ProductFilterComponent } from '../components/product-filter/product-filter.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { BreadcrumbsComponent } from '../../../shared/home-components/for-features/breadcrumbs/breadcrumbs.component';

@Component({
  standalone: true,
  selector: 'app-shop-page',
  imports: [
    CommonModule,
    ProductListComponent,
    ProductFilterComponent,
    SidebarComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss']
})
export class ShopPage {}
