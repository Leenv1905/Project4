import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from '../../shared/home-components/for-features/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';

// import { ProductListComponent } from '../components/product-list/product-list.component';
// import { ProductFilterComponent } from '../components/product-filter/product-filter.component';
// import { SidebarComponent } from '../components/sidebar/sidebar.component';
// import { BreadcrumbsComponent } from '../../../shared/home-components/for-features/breadcrumbs/breadcrumbs.component';

@Component({
  standalone: true,
  selector: 'app-about',
  imports: [CommonModule, BreadcrumbsComponent, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {}
