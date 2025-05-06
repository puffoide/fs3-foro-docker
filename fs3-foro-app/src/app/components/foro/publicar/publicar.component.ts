import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { CategoriaDTO } from '../../../models/categoria.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../../services/autenticacion.service';

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
    private authService: AutenticacionService,
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      categoriaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    this.foroService.obtenerCategorias().subscribe({
      next: data => this.categorias = data,
      error: () => alert('Error al cargar categorías')
    });
  }

  publicar(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const usuario = this.authService.obtenerUsuarioActivo();
    console.log(usuario)
    if (!usuario) {
      alert('Usuario no autenticado');
      return;
    }

    const publicacion = {
      ...this.form.value,
      usuarioId: usuario.id,
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
