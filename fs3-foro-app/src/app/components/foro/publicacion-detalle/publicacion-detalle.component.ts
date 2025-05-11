import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../../services/foro.service';
import { PublicacionDTO } from '../../../models/publicacion.model';
import { ComentarioDTO } from '../../../models/comentario.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutenticacionService } from '../../../services/autenticacion.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss'],
})
export class PublicacionDetalleComponent implements OnInit {
  publicacion?: PublicacionDTO;
  comentarios: ComentarioDTO[] = [];
  comentarioForm: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private foroService: ForoService,
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router
  ) {
    this.comentarioForm = this.fb.group({
      contenido: ['', Validators.required],
      usuarioId: [1],
    });
    this.publicacionForm = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
    });
  }

  usuarioActual: any;
  modoEdicionPublicacion = false;
  publicacionForm: FormGroup;

  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.publicacion) {
      this.publicacionForm.patchValue({
        titulo: this.publicacion.titulo,
        contenido: this.publicacion.contenido,
      });
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.foroService
      .getPublicacion(id)
      .subscribe((p) => (this.publicacion = p));
    this.foroService.getComentariosByPublicacion(id).subscribe((c) => {
      this.comentarios = c.map((com) => ({ ...com, editando: false }));
    });

    const usuario = this.authService.obtenerUsuarioActivo();
    if (usuario) {
      this.usuarioActual = usuario;
      this.comentarioForm.patchValue({ usuarioId: usuario.id });
    }
  }

  puedeModificarComentario(com: ComentarioDTO): boolean {
    return (
      this.usuarioActual &&
      (this.usuarioActual.id === com.usuarioId ||
        this.usuarioActual.role === 'ADMIN')
    );
  }

  editarComentario(com: any): void {
    com._original = com.contenido;
    com.editando = true;
  }

  cancelarEdicion(com: any): void {
    com.contenido = com._original;
    com.editando = false;
    delete com._original;
  }

  guardarComentario(com: any): void {
  const { editando, _original, ...limpio } = com;

  const actualizado = {
    id: limpio.id,
    contenido: limpio.contenido,
    fecha: new Date().toISOString(),
    publicacionId: limpio.publicacionId,
    usuarioId: limpio.usuarioId,
    username: limpio.username,
    rol: limpio.rol
  };


  if (actualizado.id !== undefined) {
    this.foroService
      .editarComentario(actualizado.id, actualizado)
      .subscribe((res) => {
        Object.assign(com, res);
        com.editando = false;
      });
  } else {
    console.error('No se puede editar el comentario porque no tiene un ID definido.');
  }
}


  puedeEliminarComentario(comentario: ComentarioDTO): boolean {
    const usuario = this.authService.obtenerUsuarioActivo();
    return (
      usuario != null &&
      (usuario.id === comentario.usuarioId || usuario.role === 'ADMIN')
    );
  }

  eliminarComentario(id: number): void {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      this.foroService.eliminarComentario(id).subscribe(() => {
        this.comentarios = this.comentarios.filter((c) => c.id !== id);
      });
    }
  }

  enviarComentario(): void {
    this.submitted = true;
    if (this.comentarioForm.invalid || !this.publicacion) return;

    const nuevoComentario: Omit<ComentarioDTO, 'id'> = {
      contenido: this.comentarioForm.value.contenido,
      fecha: new Date().toISOString(),
      usuarioId: this.usuarioActual.id,
      publicacionId: this.publicacion.id,
    };

    this.foroService.agregarComentario(nuevoComentario).subscribe((c) => {
      this.comentarios.push({
        ...c,
        username: this.usuarioActual.username,
        rol: this.usuarioActual.role,
        editando: false,
      });
      this.comentarioForm.reset();
      this.submitted = false;
    });
  }

  editarPublicacion(): void {
    if (!this.publicacion) return;

    this.publicacionForm.patchValue({
      titulo: this.publicacion.titulo,
      contenido: this.publicacion.contenido,
    });

    this.modoEdicionPublicacion = true;
  }

  guardarEdicionPublicacion(): void {
    if (this.publicacionForm.invalid || !this.publicacion) return;

    const editada = {
      ...this.publicacion,
      titulo: this.publicacionForm.value.titulo,
      contenido: this.publicacionForm.value.contenido,
    };

    this.foroService.editarPublicacion(editada).subscribe((p) => {
      this.publicacion = p;
      this.modoEdicionPublicacion = false;
    });
  }

  puedeEditarPublicacion(): boolean {
    const usuario = this.authService.obtenerUsuarioActivo();
    return usuario?.role === 'ADMIN';
  }

  eliminarPublicacion(): void {
    if (!this.publicacion) return;
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.foroService
        .eliminarPublicacion(this.publicacion.id)
        .subscribe(() => {
          this.router.navigate(['/foro']);
        });
    }
  }
}
