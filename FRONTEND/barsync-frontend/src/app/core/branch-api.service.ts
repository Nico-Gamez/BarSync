import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { BranchService } from './branch.service';

@Injectable({ providedIn: 'root' })
export class BranchApiService {
  constructor(private branchService: BranchService) {}

  // Agrega branchId como query param si existe
  withBranchParam(url: string): string {
    const branchId = this.branchService.getBranchId();
    if (branchId) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}branchId=${branchId}`;
    }
    return url;
  }

  // Agrega el token en headers
  getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}
