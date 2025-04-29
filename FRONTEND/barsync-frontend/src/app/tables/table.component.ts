import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableService } from '../core/table.service';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  tables: any[] = [];
  newTableNumber: number = 0;
  newTableStatus: string = 'free';
  role: string = '';
  successMessage: string = ''; // 👈 Nuevo para mostrar el toast

  constructor(
    private tableService: TableService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTables();
    const tokenData = this.authService.getUserData();
    this.role = tokenData?.role || '';
  }

  loadTables() {
    this.tableService.getAll().subscribe({
      next: (res) => {
        this.tables = res.data;
      },
      error: (err) => {
        console.error('Error loading tables', err);
      }
    });
  }

  createTable() {
    if (this.newTableNumber > 0) {
      const newTable = {
        table_number: this.newTableNumber,
        status: this.newTableStatus
      };
      this.tableService.create(newTable).subscribe({
        next: () => {
          this.newTableNumber = 0;
          this.newTableStatus = 'free';
          this.loadTables();
          this.showSuccess('✅ Mesa creada exitosamente.');
        },
        error: (err) => {
          console.error('Error creating table', err);
        }
      });
    }
  }

  toggleTableStatus(table: any) {
    const newStatus = table.status === 'free' ? 'occupied' : 'free';
    this.tableService.updateStatus(table.id, newStatus).subscribe({
      next: () => this.loadTables(),
      error: (err) => console.error('Error updating table status', err)
    });
  }

  createOrder(tableId: number) {
    console.log('➡️ Crear pedido para la mesa ID:', tableId);
    this.router.navigate(['/orders/new', tableId]);
  }

  deleteTable(id: number) {
    if (confirm('¿Estás seguro de eliminar esta mesa?')) {
      this.tableService.delete(id).subscribe({
        next: () => this.loadTables(),
        error: (err) => console.error('Error deleting table', err)
      });
    }
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000); // Toast desaparece después de 3 segundos
  }
}
