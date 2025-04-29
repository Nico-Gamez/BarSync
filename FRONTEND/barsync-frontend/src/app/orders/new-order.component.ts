import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../core/order.service';
import { ProductService } from '../core/product.service';
import { TableService } from '../core/table.service'; // ✅ IMPORTADO

@Component({
  selector: 'app-new-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-order.component.html'
})
export class NewOrderComponent implements OnInit {
  tableId!: number;
  tableNumber!: number;
  productsAdded: any[] = [];
  availableProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private tableService: TableService // ✅ INYECTADO
  ) {}

  ngOnInit() {
    this.tableId = Number(this.route.snapshot.paramMap.get('tableId'));

    // ✅ Cargar número real de mesa
    this.tableService.getTableById(this.tableId).subscribe({
      next: (res) => {
        this.tableNumber = res.data.table_number;
      },
      error: (err) => {
        console.error('❌ Error obteniendo datos de la mesa:', err);
        this.tableNumber = this.tableId; // fallback temporal
      }
    });

    this.loadInventory();
  }

  loadInventory() {
    this.productService.getAll().subscribe({
      next: (res) => {
        console.log('📦 Productos cargados:', res.data);
        this.availableProducts = res.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: p.stock || 0
        }));
      },
      error: (err) => {
        console.error('❌ Error cargando inventario:', err);
      }
    });
  }

  addProduct(product: any) {
    const inventoryProduct = this.availableProducts.find(p => p.id === product.id || p.id === product.productId);

    if (!inventoryProduct || inventoryProduct.quantity <= 0) {
      alert('⚠️ No hay suficiente stock de este producto.');
      return;
    }

    const existing = this.productsAdded.find(p => p.productId === (product.id || product.productId));
    if (existing) {
      existing.quantity += 1;
    } else {
      this.productsAdded.push({
        productId: product.id,
        name: product.name,
        quantity: 1,
        unitPrice: product.price
      });
    }

    inventoryProduct.quantity -= 1;
  }

  decreaseProduct(product: any) {
    const existing = this.productsAdded.find(p => p.productId === product.productId);
    const inventoryProduct = this.availableProducts.find(p => p.id === product.productId);

    if (existing) {
      existing.quantity -= 1;
      inventoryProduct.quantity += 1;
      if (existing.quantity <= 0) {
        this.productsAdded = this.productsAdded.filter(p => p.productId !== product.productId);
      }
    }
  }

  confirmOrder() {
    if (this.productsAdded.length === 0) {
      alert('⚠️ Debes agregar al menos un producto.');
      return;
    }

    const orderPayload = {
      tableId: this.tableId,
      products: this.productsAdded
    };

    this.orderService.createOrder(orderPayload).subscribe({
      next: () => {
        alert('✅ Pedido creado exitosamente.');
        this.router.navigate(['/tables']);
      },
      error: (err) => {
        console.error('❌ Error creando el pedido:', err);
      }
    });
  }

  cancelOrder() {
    if (confirm('¿Cancelar pedido?')) {
      this.router.navigate(['/tables']);
    }
  }
}
