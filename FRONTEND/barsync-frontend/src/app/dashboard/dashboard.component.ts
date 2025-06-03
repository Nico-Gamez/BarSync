import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchService } from '../core/branch.service';
import { AuthService } from '../core/auth.service';

interface Module {
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 necesario para *ngFor y routerLink
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  modules: Module[] = [];
  role: string = '';

  constructor(
    private router: Router,
    private branchService: BranchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const branchId = this.branchService.getBranchId();
    if (!branchId) {
      this.router.navigate(['/branch-selection']);
      return;
    }

    const user = this.authService.getUserData();
    this.role = user?.role || '';

    this.setupModules();
  }

  setupModules() {
    if (this.role === 'admin') {
      this.modules = [
        { title: 'Mesas', description: 'Gestionar mesas', link: '/tables' },
        { title: 'Productos', description: 'Gestionar productos', link: '/products' },
        { title: 'Reportes', description: 'Reporte de productos por fecha', link: '/report-product'  },
        { title: 'Pedidos', description: 'Gestionar pedidos', link: '/orders' },
        { title: 'Pagos', description: 'Gestionar pagos', link: '/payments' },
        { title: 'Usuarios', description: 'Crear y administrar usuarios', link: '/user-management' }
      ];
    } else if (this.role === 'cashier') {
      this.modules = [
        { title: 'Productos', description: 'Gestionar productos', link: '/products' },
        { title: 'Reportes', description: 'Reporte de productos por fecha', link: '/report-product'  },
        { title: 'Pedidos', description: 'Gestionar pedidos', link: '/orders' },
        { title: 'Pagos', description: 'Gestionar pagos', link: '/payments' }
      ];
    } else if (this.role === 'waiter') {
      this.modules = [
        { title: 'Mesas', description: 'Gestionar mesas', link: '/tables' }
      ];
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
