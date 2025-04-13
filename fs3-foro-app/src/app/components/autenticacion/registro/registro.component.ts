import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../services/session.service';
import { UserDTO } from '../../../models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent {
  registerForm: FormGroup;
  submitted = false;
  registroExitoso = false;
  registroError = false;
  mensajeError = 'Ocurrió un error al registrarse.'; 

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
          ),
        ],
      ],
      role: ['USER', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.registroExitoso = false;
    this.registroError = false;

    if (this.registerForm.invalid) return;

    const username = this.registerForm.value.username;

    if (this.sessionService.usernameExists(username)) {
      this.registroError = true;
      this.mensajeError = 'El nombre de usuario ya existe.';
      return;
    }

    const nuevoUsuario: UserDTO = {
      ...this.registerForm.value,
      id: Math.floor(Math.random() * 1000) + 1,
    };

    this.sessionService.saveUserToList(nuevoUsuario);
    this.sessionService.setUser(nuevoUsuario);

    this.registroExitoso = true;

    setTimeout(() => {
      this.router.navigate(['/foro']);
    }, 1500);
  }
}
