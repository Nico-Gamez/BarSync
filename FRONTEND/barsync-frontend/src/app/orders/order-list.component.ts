import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../core/order.service';
import { PaymentService } from '../core/payment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  selectedOrderId: number | null = null;
  expandedOrderId: number | null = null;
  orderDetails: { [key: number]: any[] } = {};

  newPayment = {
    paymentMethod: 'cash',
    totalPaid: 0
  };

  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe({
      next: (res) => {
        // Filtrar los pedidos cuyo estado NO sea 'paid'
        this.orders = res.data.filter((order: any) => order.status !== 'paid');
      },
      error: (err) => console.error('❌ Error cargando pedidos:', err)
    });
  }
  

  generatePayment(orderId: number): void {
    this.selectedOrderId = orderId;
    this.newPayment = {
      paymentMethod: 'cash',
      totalPaid: 0
    };
  }

  submitPayment(): void {
    if (!this.selectedOrderId) return;

    const body = {
      orderId: this.selectedOrderId,
      paymentMethod: this.newPayment.paymentMethod,
      totalPaid: this.newPayment.totalPaid
    };

    this.paymentService.create(body).subscribe({
      next: () => {
        alert('✅ Pago registrado con éxito');
        this.selectedOrderId = null;
        this.loadOrders();
      },
      error: (err) => {
        console.error('❌ Error al registrar el pago:', err);
        alert('❌ Error al registrar el pago');
      }
    });
  }

  toggleDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
      return;
    }

    this.expandedOrderId = orderId;

    if (this.orderDetails[orderId]) return;

    this.orderService.getOrderDetails(orderId).subscribe({
      next: (res) => this.orderDetails[orderId] = res.data,
      error: (err) => console.error('❌ Error cargando detalles:', err)
    });
  }

  getTotal(orderId: number): number {
    const details = this.orderDetails[orderId];
    if (!details) return 0;
    return details.reduce((sum, item) => sum + parseFloat(item.total), 0);
  }
  
  
}
