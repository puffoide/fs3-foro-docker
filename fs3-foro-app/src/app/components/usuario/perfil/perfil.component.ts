import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { UserDTO } from '../../../models/usuario.model';
import { SessionService } from '../../../services/session.service';
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
    private sessionService: SessionService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    
    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']); 
      return;
    }

    this.user = this.sessionService.getUser();
    this.loading = false;

    // const userId = this.sessionService.getUser()?.id ?? 0;

    // this.authService.getUserById(userId).subscribe({
    //   next: data => {
    //     this.user = data;
    //     this.loading = false;
    //   },
    //   error: () => {
    //     this.error = true;
    //     this.loading = false;
    //   }
    // });
    
  }
}
