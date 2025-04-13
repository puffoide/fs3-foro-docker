import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { CategoriaDTO } from '../../../models/categoria.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-publicar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicar.component.html',
  styleUrls: ['./publicar.component.scss']
})
export class PublicarComponent implements OnInit {
  form: FormGroup;
  categorias: CategoriaDTO[] = [];
  submitted = false;
  success = false;

  constructor(
    private fb: FormBuilder,
    private foroService: ForoService,
    private router: Router,
    private sessionService: SessionService
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      categoriaId: ['', Validators.required],
      usuarioId: [1] // simulado, reemplazar por sesión real
    });
  }

  ngOnInit(): void {

    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.foroService.getCategorias().subscribe({
      next: data => this.categorias = data,
      error: () => alert('Error al cargar categorías')
    });
  }

  publicar(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const publicacion = {
      ...this.form.value,
      fechaCreacion: new Date().toISOString()
    };

    this.foroService.crearPublicacion(publicacion).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/foro']), 1500);
      },
      error: () => alert('Error al publicar')
    });
  }
}
