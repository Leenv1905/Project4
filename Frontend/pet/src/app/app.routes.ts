import {Routes} from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {HomeLayoutComponent} from './layouts/home/home-layout.component';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';
// import {MainLayoutComponent} from './layouts/main-layout/main-layout.component';

export const routes: Routes = [

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    // canActivateChild: [adminGuard],Nếu muốn chi tiet hơn (không chặn việc load layout - ưu điểm có thể bấm login ở đây)
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)}

      // { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES), canActivate: [adminGuard]}
      // { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES), canActivate: [adminGuard]}

    ]
  },

  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.page') .then(m => m.HomePage) },
      { path: 'shop', loadComponent: () => import('./features/shop/pages/shop.page') .then(m => m.ShopPage)},
      { path: 'productdetail/:id', loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)},
      { path: 'checkout', loadComponent: () => import('./features/checkout/pages/checkout-page.component').then(m => m.CheckoutPageComponent), canActivate: [authGuard]},
      { path: 'success', loadComponent: () => import('./features/checkout/pages/success-page.component').then(m => m.SuccessPageComponent), canActivate: [authGuard]},
      { path: 'cart', loadComponent: () => import('./features/cart/pages/cart-page.component').then(m => m.CartPageComponent), canActivate: [authGuard]}

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
