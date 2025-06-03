import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementService } from '../core/user-management.service';
import { BranchService } from '../core/branch.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  branches: any[] = [];

  newUser = {
    name: '',
    email: '',
    password: '',
    role: 'waiter',
    branchId: null,
  };

  passwordUserId: number | null = null;
  newPassword: string = '';

  constructor(
    private userService: UserManagementService,
    private branchService: BranchService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadBranches();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => (this.users = res.data),
      error: (err) => console.error('❌ Error cargando usuarios:', err),
    });
  }

  loadBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (res) => (this.branches = res.data),
      error: (err) => console.error('❌ Error cargando sucursales:', err),
    });
  }

  createUser() {
    const { name, email, password, role, branchId } = this.newUser;
    if (!name || !email || !password || !role || !branchId) {
      alert('⚠️ Todos los campos son obligatorios.');
      return;
    }

    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert('✅ Usuario creado correctamente.');
        this.newUser = {
          name: '',
          email: '',
          password: '',
          role: 'waiter',
          branchId: null,
        };
        this.loadUsers();
      },
      error: (err) => {
        console.error('❌ Error al crear usuario:', err);
        alert('❌ Error al crear el usuario.');
      },
    });
  }

  startPasswordChange(userId: number) {
    this.passwordUserId = userId;
    this.newPassword = '';
  }

  updatePassword() {
    if (!this.newPassword || !this.passwordUserId) {
      return;
    }

    this.userService
      .changePassword(this.passwordUserId, this.newPassword)
      .subscribe({
        next: () => {
          alert('✅ Contraseña actualizada correctamente.');
          this.passwordUserId = null;
          this.newPassword = '';
        },
        error: (err) => {
          console.error('❌ Error actualizando contraseña:', err);
          alert('❌ No se pudo actualizar la contraseña.');
        },
      });
  }
}
