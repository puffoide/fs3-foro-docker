import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../../../../models/usuario.model';
import { AutenticacionService } from '../../../../services/autenticacion.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: UserDTO[] = [];
  loading = false;
  error: string | null = null;

  constructor(private authService: AutenticacionService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.loading = true;
    this.authService.obtenerTodosLosUsuarios().subscribe({
      next: (data:any) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = 'No se pudieron cargar los usuarios';
        this.loading = false;
      }
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro que deseas eliminar este usuario?')) {
      this.authService.eliminarUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
        },
        error: () => {
          alert('Error al eliminar usuario');
        }
      });
    }
  }
}
