import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../core/payment.service';
import { OrderService } from '../core/order.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './payment.component.html',
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  orders: any[] = [];
  newPayment = { orderId: 0, paymentMethod: 'cash', totalPaid: 0 };

  constructor(
    private paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadPayments();
    this.loadConfirmedOrders();
  }

  loadPayments() {
    this.paymentService.getAll().subscribe({
      next: (res) => {
        this.payments = res.data;
      },
      error: (err) => {
        console.error('❌ Error loading payments:', err);
      },
    });
  }

  loadConfirmedOrders() {
    this.orderService.getOrdersByStatus('confirmed').subscribe({
      next: (res) => {
        this.orders = res.data;
      },
      error: (err) => {
        console.error('❌ Error loading confirmed orders:', err);
      },
    });
  }

  selectOrder(order: any) {
    this.newPayment.orderId = order.id;
    this.newPayment.totalPaid = 0; // Se puede calcular según detalles del pedido si quieres
  }

  createPayment() {
    if (this.newPayment.orderId === 0 || this.newPayment.totalPaid <= 0) {
      alert('⚠️ Selecciona una orden y un monto válido.');
      return;
    }

    this.paymentService.create(this.newPayment).subscribe({
      next: () => {
        // ✅ Opcional: actualizar orden a paid después del pago
        this.orderService
          .updateStatus(this.newPayment.orderId, 'paid')
          .subscribe({
            next: () => {
              alert('✅ Pago realizado y orden actualizada.');
              this.newPayment = {
                orderId: 0,
                paymentMethod: 'cash',
                totalPaid: 0,
              };
              this.loadPayments();
              this.loadConfirmedOrders();
            },
            error: (err) => {
              console.error('❌ Error updating order status:', err);
            },
          });
      },
      error: (err) => {
        console.error('❌ Error creating payment:', err);
      },
    });
  }

  expandedPaymentId: number | null = null;
  paymentDetails: { [orderId: number]: any[] } = {};

  toggleDetails(orderId: number): void {
    if (this.expandedPaymentId === orderId) {
      this.expandedPaymentId = null;
      return;
    }

    this.expandedPaymentId = orderId;

    if (this.paymentDetails[orderId]) return;

    this.paymentService.getDetails(orderId).subscribe({
      next: (res) => (this.paymentDetails[orderId] = res.data),
      error: (err) =>
        console.error('❌ Error cargando detalles del pago:', err),
    });
  }
}
