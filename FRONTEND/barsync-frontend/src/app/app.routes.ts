import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './core/auth.guard';
import { TableComponent } from '../app/tables/table.component';
import { BranchSelectionComponent } from '../app/branchs/branch-selection.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'branch-selection', component: BranchSelectionComponent },
  { path: 'tables', component: TableComponent },

  // Productos
  {
    path: 'products',
    loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/product-detail.component').then(m => m.ProductDetailComponent),
    canActivate: [AuthGuard]
  },

  // Pedidos
  {
    path: 'orders',
    loadComponent: () => import('./orders/order-list.component').then(m => m.OrderListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/new/:tableId',
    loadComponent: () => import('./orders/new-order.component').then(m => m.NewOrderComponent),
    canActivate: [AuthGuard]
  },

  // Pagos
  {
    path: 'payments',
    loadComponent: () => import('./payments/payment.component').then(m => m.PaymentsComponent),
    canActivate: [AuthGuard]
  },

  // Rutas por defecto
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
