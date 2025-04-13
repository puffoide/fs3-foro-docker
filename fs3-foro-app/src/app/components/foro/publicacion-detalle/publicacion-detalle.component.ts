import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../../services/foro.service';
import { PublicacionDTO } from '../../../models/publicacion.model';
import { ComentarioDTO } from '../../../models/comentario.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './publicacion-detalle.component.html',
  styleUrls: ['./publicacion-detalle.component.scss']
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
    private sessionService: SessionService,
    private router: Router
  ) {
    this.comentarioForm = this.fb.group({
      contenido: ['', Validators.required],
      usuarioId: [1],
    });
  }

  ngOnInit(): void {
    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.foroService.getPublicacion(id).subscribe(p => this.publicacion = p);
    this.foroService.getComentariosByPublicacion(id).subscribe(c => this.comentarios = c);
  }

  enviarComentario(): void {
    this.submitted = true;
    if (this.comentarioForm.invalid || !this.publicacion) return;

    const nuevo: ComentarioDTO = {
      id: 0,
      contenido: this.comentarioForm.value.contenido,
      fecha: new Date().toISOString(),
      usuarioId: this.comentarioForm.value.usuarioId,
      publicacionId: this.publicacion.id
    };

    this.foroService.agregarComentario(nuevo).subscribe(c => {
      this.comentarios.push(c);
      this.comentarioForm.reset();
      this.submitted = false;
    });
  }
}
