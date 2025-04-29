import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchService } from './branch.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private branchService: BranchService) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private withBranchParam(url: string): string {
    const branchId = this.branchService.getBranchId();
    if (branchId) {
      return `${url}?branchId=${branchId}`;
    }
    return url;
  }

  // 👇 AHORA RECIBE UN OBJETO y no solo tableId
  createOrder(order: { tableId: number; products: any[] }): Observable<any> {
    return this.http.post(this.apiUrl, order, this.getHeaders());
  }

  addProduct(orderId: number, productId: number, quantity: number, unitPrice: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orderId}/products`, { productId, quantity, unitPrice }, this.getHeaders());
  }

  confirmOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/confirm`, {}, this.getHeaders());
  }

  getOrders(): Observable<any> {
    return this.http.get(this.withBranchParam(this.apiUrl), this.getHeaders());
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orderId}`, this.getHeaders());
  }

  getOrdersByStatus(status: string): Observable<any> {
    return this.http.get(this.withBranchParam(`${this.apiUrl}?status=${status}`), this.getHeaders());
  }
  
  updateStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { status }, this.getHeaders());
  }

  getAll(): Observable<any> {
    return this.getOrders(); // Alias para compatibilidad con order-list.component.ts
  }  
  
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}/details`, this.getHeaders());
  }
  
}
