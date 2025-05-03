import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { UserDTO } from '../../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ){}
  
  get isLoggedIn(): boolean {
    return this.authService.estaAutenticado();
  }
  
  get user(): UserDTO | null {
    return this.authService.obtenerUsuarioActivo();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }  
  
}
