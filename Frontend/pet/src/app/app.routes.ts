import {Routes} from '@angular/router';
import {AdminLayoutComponent} from './layouts/admin/admin-layout.component';
import {HomeLayoutComponent} from './layouts/home/home-layout.component';
import {authGuard} from './core/guards/auth.guard';
import {adminGuard} from './core/guards/admin.guard';
import {shopGuard} from './core/guards/shop.guard';
import {managementGuard} from './core/guards/management.guard';
import {operatorGuard} from './core/guards/operator.guard';

export const routes: Routes = [

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [managementGuard],
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/pages/dashboard.page').then(m => m.DashboardPage)},
      { path: 'operators', loadComponent: () => import('./features/admin/operator-orders/operator-orders.component').then(m => m.OperatorOrdersComponent)},
      { path: 'operators/order/:id', loadComponent: () => import('./features/admin/operator-orders/operator-order-detail/operator-order-detail.component').then(m => m.OperatorOrderDetailComponent)},
      { path: 'products', loadComponent: () => import('./features/admin/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
      
      // Mới thêm
      { path: 'orders/pending', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Đơn hàng chờ tiếp nhận', icon: 'pending' } },
      { path: 'orders/returns', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Đơn trả / hủy', icon: 'undo' } },
      { path: 'shipping-settings', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Cài đặt vận chuyển', icon: 'local_shipping' } },
      { path: 'products/analytics', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Phân tích sản phẩm AI', icon: 'psychology' } },
      
      // Các route chỉ dành cho ADMIN
      { path: 'users', loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent), canActivate: [adminGuard] },
      { path: 'users/add', loadComponent: () => import('./features/admin/admin-users/create-user/admin-create-user.component').then(m => m.AdminCreateUserComponent), canActivate: [adminGuard] },
      { path: 'users/edit/:id', loadComponent: () => import('./features/admin/admin-users/edit-user/admin-edit-user.component').then(m => m.AdminEditUserComponent), canActivate: [adminGuard] },
      { path: 'users/analytics', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Phân tích khách hàng', icon: 'analytics' }, canActivate: [adminGuard] },
      { path: 'verifications', loadComponent: () => import('./features/admin/admin-verification/admin-verification.component').then(m => m.AdminVerificationComponent), canActivate: [adminGuard] },
      
      { path: 'operators/list', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Danh sách Operator', icon: 'people' }, canActivate: [adminGuard] },
      { path: 'operators/add', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Thêm Operator', icon: 'person_add' }, canActivate: [adminGuard] },
      { path: 'operators/roles', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Phân quyền', icon: 'admin_panel_settings' }, canActivate: [adminGuard] },
      
      { path: 'finance/revenue', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Doanh thu', icon: 'monetization_on' }, canActivate: [adminGuard] },
      { path: 'finance/bank', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Tài khoản ngân hàng', icon: 'account_balance_wallet' }, canActivate: [adminGuard] },
      { path: 'finance/payment', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Kênh thanh toán', icon: 'payments' }, canActivate: [adminGuard] },
      
      { path: 'settings', loadComponent: () => import('./features/admin/placeholder/admin-placeholder.component').then(m => m.AdminPlaceholderComponent), data: { title: 'Cài đặt chung', icon: 'settings' } }
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
      { path: 'payment-result', loadComponent: () => import('./features/checkout/pages/payment-result.component').then(m => m.PaymentResultComponent) },
      { path: 'cart', loadComponent: () => import('./features/cart/pages/cart-page.component').then(m => m.CartPageComponent), canActivate: [authGuard]},
      { path: 'account', loadComponent: () => import('./features/account/my-account/my-account-page/account-page.component').then(m => m.AccountPageComponent), canActivate: [authGuard]},
      { path: 'my-shop', loadComponent: () => import('./features/account/my-shop/my-shop-page/my-shop-page.component').then(m => m.MyShopPageComponent), canActivate: [shopGuard]},
      { path: 'order/:id', loadComponent: () => import('./features/account/pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [authGuard]},
      
      // Route chỉ dành cho OPERATOR
      { path: 'operator/tasks', loadComponent: () => import('./features/operator/operator-tasks/operator-tasks.component').then(m => m.OperatorTasksComponent), canActivate: [operatorGuard]}
    ]
  },
];
