import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchService } from './branch.service';

@Injectable({ providedIn: 'root' })
export class TableService {
  private apiUrl = 'http://localhost:3000/api/tables';

  constructor(private http: HttpClient, private branchService: BranchService) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAll(): Observable<any> {
    const branchId = this.branchService.getBranchId(); // 🔥 Ajustado
    return this.http.get(
      `${this.apiUrl}?branchId=${branchId}`,
      this.getHeaders()
    );
  }

  create(table: { table_number: number; status: string }): Observable<any> {
    const tokenData = JSON.parse(
      atob(localStorage.getItem('token')!.split('.')[1])
    );
    const isAdmin = tokenData?.role === 'admin';

    const branchId = this.branchService.getBranchId(); // 🔥 Usamos el de localStorage
    const payload = isAdmin ? { ...table, branchId } : table;

    return this.http.post(this.apiUrl, payload, this.getHeaders());
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/status/${id}`,
      { status },
      this.getHeaders()
    );
  }

  assignTable(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/assign/${id}`, {}, this.getHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  getTableById(id: number): Observable<any> {
    return this.http.get(
      `http://localhost:3000/api/tables/${id}`,
      this.getHeaders()
    );
  }
}
