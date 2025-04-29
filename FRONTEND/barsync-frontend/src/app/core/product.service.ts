import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchService } from './branch.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

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
    if (branchId !== null) {
      return `${url}?branchId=${branchId}`;
    }
    return url;
  }

  getAll(): Observable<any> {
    return this.http.get(this.withBranchParam(this.apiUrl), this.getHeaders());
  }

  create(product: any): Observable<any> {
    const branchId = this.branchService.getBranchId();
    const body = { ...product, branchId }; // 🔥 siempre incluir branchId en creación
    return this.http.post(this.apiUrl, body, this.getHeaders());
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product, this.getHeaders());
  }
  

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }
}
