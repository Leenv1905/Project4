import {Routes} from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {HomeLayoutComponent} from './layouts/home/home-layout.component';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';
import {shopGuard} from './core/guards/shop.guard';
import {
  OperatorOrderDetailComponent
} from './features/admin/operator-orders/operator-order-detail/operator-order-detail.component';

export const routes: Routes = [

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    // canActivateChild: [adminGuard],Nếu muốn chi tiet hơn (không chặn việc load layout - ưu điểm có thể bấm login ở đây)
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/pages/dashboard.page').then(m => m.DashboardPage)},
      { path: 'operators', loadComponent: () => import('./features/admin/operator-orders/operator-orders.component').then(m => m.OperatorOrdersComponent)},
      { path: 'operators/order/:id', loadComponent: () => import('./features/admin/operator-orders/operator-order-detail/operator-order-detail.component').then(m => m.OperatorOrderDetailComponent)},
      { path: 'products', loadComponent: () => import('./features/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'users/add', loadComponent: () => import('./features/admin/admin-users/create-user/admin-create-user.component').then(m => m.AdminCreateUserComponent) },
      { path: 'users/edit/:id', loadComponent: () => import('./features/admin/admin-users/edit-user/admin-edit-user.component').then(m => m.AdminEditUserComponent) }
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
      { path: 'cart', loadComponent: () => import('./features/cart/pages/cart-page.component').then(m => m.CartPageComponent), canActivate: [authGuard]},
      { path: 'account', loadComponent: () => import('./features/account/my-account/my-account-page/account-page.component').then(m => m.AccountPageComponent), canActivate: [authGuard]},
      { path: 'my-shop', loadComponent: () => import('./features/account/my-shop/my-shop-page/my-shop-page.component').then(m => m.MyShopPageComponent), canActivate: [shopGuard]},
      { path: 'order/:id', loadComponent: () => import('./features/account/pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard]},
      // { path:'my-shop/add-product', loadComponent: () => import('./features/account/pages/my-shop/add-product.component').then(m => m.AddProductComponent)},
      // { path:'my-shop/edit-product/:id', loadComponent: () => import('./features/account/pages/my-shop/edit-product.component').then(m => m.EditProductComponent)}
      // { path: 'myaccount', loadComponent: () => import('./features/home/myaccount.page') .then(m => m.MyaccountPage) }
    ]
  },


];
