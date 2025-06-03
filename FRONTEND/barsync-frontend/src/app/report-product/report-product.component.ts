import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductService } from '../core/product.service';
import { AuthService } from '../core/auth.service';
import { BranchService } from '../core/branch.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-report-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './report-product.component.html'
})
export class ReportProductComponent implements OnInit {
  startDate: string = '';
  endDate: string = '';
  format: string = 'xlsx';

  isAdmin: boolean = false;
  branches: any[] = [];
  selectedBranchId: number | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private branchService: BranchService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.getRole() === 'admin';

    if (this.isAdmin) {
      this.branchService.getAllBranches().subscribe({
        next: (res) => {
          this.branches = res.data;
        },
        error: (err) => {
          console.error('❌ Error cargando sedes:', err);
        }
      });
    } else {
      // Para cajeros, usar branchId del localStorage
      const storedBranchId = localStorage.getItem('branchId');
      this.selectedBranchId = storedBranchId ? parseInt(storedBranchId) : null;
    }
  }

  downloadReport() {
    if (!this.startDate || !this.endDate) {
      alert('Debes seleccionar un rango de fechas');
      return;
    }

    this.productService
      .downloadReportFiltered(this.startDate, this.endDate, this.format, this.selectedBranchId || undefined)
      .subscribe({
        next: (data: Blob) => {
          const filename = `reporte_productos_vendidos.${this.format}`;
          saveAs(data, filename);
        },
        error: (err) => {
          console.error('❌ Error descargando el reporte:', err);
          alert('❌ Error generando el reporte.');
        }
      });
  }
}
