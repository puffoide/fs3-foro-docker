import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { UserDTO } from '../../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.scss']
})
export class EditarPerfilComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  success = false;
  error = false;
  userId = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/)
        ]
      ],
      role: ['USER']
    });


  }

  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
  
    const usuario = this.authService.obtenerUsuarioActivo();
    if (usuario) {
      this.form.setValue({
        username: usuario.username,
        password: usuario.password,
        role: usuario.role
      });
      this.userId = usuario.id;
    }
  }
  
  guardarCambios(): void {
    this.submitted = true;
    if (this.form.invalid) return;
  
    const actualizado: UserDTO = {
      ...this.form.value,
      id: this.userId
    };
  
    this.authService.updateUser(this.userId, actualizado).subscribe({
      next: () => {
        this.authService.guardarUsuarioEnSesion(actualizado);
        this.success = true;
        setTimeout(() => this.router.navigate(['/perfil']), 1500);
      },
      error: () => this.error = true
    });
  }  
}
