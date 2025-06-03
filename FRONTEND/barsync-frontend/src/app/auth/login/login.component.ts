import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.data.token);

          const user = this.authService.getUserData();
          console.log('✅ Rol del usuario:', user?.role);

          // 🔥 Redirigir primero a branch-selection siempre
          this.router.navigate(['/branch-selection']);
        },
        error: (err) => {
          if (err.error?.code === 'E01') {
            this.errorMessage =
              'Credenciales incorrectas. Olvidaste tu contraseña?';
          } else {
            this.errorMessage = 'Error del servidor. Por favor intenta más tarde.';
          }
        },
      });
    }
  }
}
