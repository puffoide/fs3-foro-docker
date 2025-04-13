import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../services/session.service';
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
    public sessionService: SessionService,
    private router: Router
  ){}
  
  get isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn();
  }
  
  get user(): UserDTO | null {
    return this.sessionService.getUser();
  }

  logout(): void {
    this.sessionService.logout();
    this.router.navigate(['/']);
  }
}
