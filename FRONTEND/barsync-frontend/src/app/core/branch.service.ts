import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BranchService {
  private readonly branchKey = 'branchId';
  private apiUrl = 'http://localhost:3000/api/branches';

  constructor(private http: HttpClient) {}

  setBranchId(branchId: number) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.branchKey, branchId.toString());
    }
  }

  getBranchId(): number | null {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem(this.branchKey);
      return id ? parseInt(id, 10) : null;
    }
    return null;
  }

  clearBranchId() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.branchKey);
    }
  }

  getAllBranches(): Observable<{ data: any[] }> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ data: any[] }>(this.apiUrl, { headers });
  }

  getBranchById(id: number): Observable<{ data: any }> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ data: any }>(`${this.apiUrl}/${id}`, { headers });
  }
}
