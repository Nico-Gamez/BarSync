import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BranchService {
  
  private readonly branchKey = 'branchId';
  private apiUrl = 'http://localhost:3000/api/branches'; // 🔥 Nuevo para consumir el backend

  constructor(private http: HttpClient) {} // 🔥 Constructor para HttpClient

  setBranchId(branchId: number) {
    localStorage.setItem(this.branchKey, branchId.toString());
  }

  getBranchId(): number | null {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem(this.branchKey);
      return id ? parseInt(id, 10) : null;
    }
    return null;
  }

  clearBranchId() {
    localStorage.removeItem(this.branchKey);
  }

  // 🔥 Nuevo método para traer sedes
  getAllBranches(): Observable<{ data: any[] }> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ data: any[] }>(this.apiUrl, { headers });
  }
  
  
}
