import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BranchService } from '../core/branch.service';
import { AuthService } from '../core/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule], // ✅ necesario para ngModel, ngValue, routerLink
  templateUrl: './branch-selection.component.html'
})
export class BranchSelectionComponent implements OnInit {
  branchId: number | null = null;
  branches: any[] = [];

  constructor(
    private branchService: BranchService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const storedBranch = this.branchService.getBranchId();
    if (storedBranch) {
      this.branchId = storedBranch;
    }

    const user = this.authService.getUserData();
    if (user?.role === 'admin') {
      this.loadBranches();
    }
  }

  loadBranches() {
    const token = localStorage.getItem('token');
    this.http.get<any>('http://localhost:3000/api/branches', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res) => {
        this.branches = res.data;
      },
      error: (err) => {
        console.error('❌ Error cargando sedes:', err);
      }
    });
  }

  selectBranch() {
    if (this.branchId !== null) {
      this.branchService.setBranchId(this.branchId);
      this.router.navigate(['/dashboard']);
    } else {
      alert('⚠️ Por favor selecciona una sede válida.');
    }
  }
}
