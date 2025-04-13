import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { UserDTO } from '../../../models/usuario.model';
import { Router } from '@angular/router';
import { SessionService } from '../../../services/session.service';

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
    private sessionService: SessionService
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

    this.userId = this.sessionService.getUser()?.id ?? 0;

  }

  ngOnInit(): void {
    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const usuario = this.sessionService.getUser();
  if (usuario) {
    this.form.setValue({
      username: usuario.username,
      password: usuario.password,
      role: usuario.role
    });
  }

    // this.authService.getUserById(this.userId).subscribe({
    //   next: (user) => {
    //     this.form.patchValue(user);
    //   },
    //   error: () => {
    //     this.error = true;
    //   }
    // });
  }

  guardarCambios(): void {
    
    this.submitted = true;

    if (this.form.invalid) return;
  
    const usuarioActualizado: UserDTO = {
      ...this.form.value,
      id: this.sessionService.getUser()?.id || 0
    };
  
    this.sessionService.setUser(usuarioActualizado);
  
    const listaUsuarios = this.sessionService.getUsersList();
    const index = listaUsuarios.findIndex(u => u.id === usuarioActualizado.id);
    if (index !== -1) {
      listaUsuarios[index] = usuarioActualizado;
      this.sessionService.saveUsersList(listaUsuarios);
    }
  
    this.success = true;
    setTimeout(() => this.router.navigate(['/perfil']), 1500);
    
    // this.submitted = true;
    // if (this.form.invalid) return;

    // this.authService.updateUser(this.userId, this.form.value).subscribe({
    //   next: () => {
    //     this.success = true;
    //     setTimeout(() => this.router.navigate(['/perfil']), 1500);
    //   },
    //   error: () => {
    //     this.error = true;
    //   }
    // });
  }
}
