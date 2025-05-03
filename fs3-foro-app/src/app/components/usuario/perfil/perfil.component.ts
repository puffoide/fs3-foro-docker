import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { UserDTO } from '../../../models/usuario.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user?: UserDTO | null;
  loading = true;
  error = false;

  constructor(
    private authService: AutenticacionService,  
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.user = this.authService.obtenerUsuarioActivo();
    this.loading = false;
  }  
  
}
