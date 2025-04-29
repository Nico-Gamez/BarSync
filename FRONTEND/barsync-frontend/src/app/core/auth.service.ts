import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('branchId'); // 🔥 Limpia también branchId al hacer logout
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getUserData(): any {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ No hay token disponible en localStorage');
        return null;
      }

      try {
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload);
        const data = JSON.parse(decodedPayload);

        // Si existe branchId en el token y no en localStorage, lo guarda
        if (data.branchId && !localStorage.getItem('branchId')) {
          localStorage.setItem('branchId', data.branchId.toString());
        }

        return data;
      } catch (e) {
        console.error('❌ Error decodificando token:', e);
        return null;
      }
    }
    return null;
  }
}
