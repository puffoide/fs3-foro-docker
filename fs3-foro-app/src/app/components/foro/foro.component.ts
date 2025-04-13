import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForoService } from '../../services/foro.service';
import { PublicacionDTO } from '../../models/publicacion.model';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss']
})
export class ForoComponent implements OnInit {
  publicaciones: PublicacionDTO[] = [];
  loading = true;
  error = false;

  constructor(
    private foroService: ForoService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.foroService.getPublicaciones().subscribe({
      next: (data) => {
        this.publicaciones = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
