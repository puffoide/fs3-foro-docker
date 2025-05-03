import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../../models/usuario.model';
import { SessionService } from '../../../services/session.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = null;
  
    if (this.loginForm.invalid) return;
  
    const { username, password } = this.loginForm.value;
  
    this.authService.login({ usuario: username, password }).subscribe({
      next: () => this.router.navigate(['/foro']),
      error: () => this.loginError = 'Credenciales inválidas'
    });
  }  
  
  
}
