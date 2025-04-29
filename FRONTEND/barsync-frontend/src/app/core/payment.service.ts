import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { BranchService } from './branch.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private branchService: BranchService
  ) {}

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

  getAll(): Observable<any> {
    return this.http.get(this.withBranchParam(this.apiUrl), this.getHeaders());
  }

  create(payment: { orderId: number; paymentMethod: string; totalPaid: number }): Observable<any> {
    const cashierId = this.authService.getUserData()?.id;
    return this.http.post(this.apiUrl, { ...payment, cashierId }, this.getHeaders());
  }

  getDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${orderId}/details`, this.getHeaders());
  }
  
  
}
