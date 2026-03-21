import {Routes} from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {HomeLayoutComponent} from './layouts/home/home-layout.component';
// import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.DASHBOARD_ROUTES)
      }
    ]
  },

  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.page') .then(m => m.HomePage) },
      { path: 'shop', loadComponent: () => import('./features/shop/pages/shop.page') .then(m => m.ShopPage)},
      { path: 'productdetail/:id', loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)}
      // { path: 'myaccount', loadComponent: () => import('./features/home/myaccount.page') .then(m => m.MyaccountPage) }
    ]
  },
  // {
  //   path: '',
  //   component: HomeLayoutComponent,
  //   children: [
  //     { path: '', redirectTo: 'books', pathMatch: 'full' },
  //     {
  //       path: 'books',
  //       loadChildren: () =>
  //         import('./features/books/book.routes')
  //           .then(m => m.BOOK_ROUTES)
  //     }
  //   ]
  // }

];
