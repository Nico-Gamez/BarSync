import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BranchApiService } from './branch-api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient, private branchApi: BranchApiService) {}

  getAll(): Observable<any> {
    return this.http.get(
      this.branchApi.withBranchParam(this.apiUrl),
      this.branchApi.getHeaders()
    );
  }

  create(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product, this.branchApi.getHeaders());
  }

  update(id: number, product: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      product,
      this.branchApi.getHeaders()
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.branchApi.getHeaders()
    );
  }

  downloadReportFiltered(
    start: string,
    end: string,
    format: string,
    branchId?: number
  ): Observable<Blob> {
    const params: any = {
      startDate: start,
      endDate: end,
      format,
    };

    if (branchId) {
      params.branchId = branchId;
    }

    return this.http.get(`${this.apiUrl}/report/filter`, {
      ...this.branchApi.getHeaders(),
      params,
      responseType: 'blob' as const,
    });
  }
}
