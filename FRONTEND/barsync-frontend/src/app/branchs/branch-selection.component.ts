import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BranchService } from '../core/branch.service';
import { AuthService } from '../core/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './branch-selection.component.html',
})
export class BranchSelectionComponent implements OnInit {
  branchId: number | null = null;
  branches: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private branchService: BranchService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserData();
    const role = user?.role;
    const branchId = user?.branchId;
    this.isAdmin = role === 'admin';

    if (this.isAdmin) {
      this.branchService.getAllBranches().subscribe({
        next: (res) => (this.branches = res.data),
        error: (err) => console.error('Error cargando sedes', err),
      });
    } else {
      this.branchService.getBranchById(branchId).subscribe({
        next: (res) => {
          this.branches = [res.data];
          this.branchId = res.data.id;
        },
        error: (err) => {
          console.error('❌ Error obteniendo sucursal asignada:', err);
          this.branches = [{
            id: branchId,
            name: 'Sucursal asignada',
            location: ''
          }];
          this.branchId = branchId;
        }
      });
    }
  }

  selectBranch(): void {
    if (!this.branchId) {
      alert('Debes seleccionar una sucursal');
      return;
    }

    this.branchService.setBranchId(this.branchId);
    this.router.navigate(['/dashboard']);
  }
}
