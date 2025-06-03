import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getAllUsers(): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(this.apiUrl, this.getHeaders());
  }

  createUser(user: {
    name: string;
    email: string;
    password: string;
    role: string;
    branchId: number | null;
  }): Observable<any> {
    return this.http.post(this.apiUrl, user, this.getHeaders());
  }

  changePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${userId}/password`,
      { newPassword },
      this.getHeaders()
    );
  }
}
