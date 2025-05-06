import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaDTO } from '../../../../models/categoria.model';
import { ForoService } from '../../../../services/foro.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categorias.component.html',
  styleUrls: ['./admin-categorias.component.scss']
})
export class AdminCategoriasComponent implements OnInit {
  categorias: CategoriaDTO[] = [];
  categoriaForm: FormGroup;
  modoEdicion: boolean = false;
  categoriaEditandoId: number | null = null;
  error: string | null = null;

  constructor(private foroService: ForoService, private fb: FormBuilder) {
    this.categoriaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.foroService.obtenerCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: () => this.error = 'Error al cargar las categorías'
    });
  }

  guardarCategoria() {
    if (this.categoriaForm.invalid) return;

    const nombre = this.categoriaForm.value.nombre;

    if (this.modoEdicion && this.categoriaEditandoId !== null) {
      this.foroService.actualizarCategoria(this.categoriaEditandoId, nombre).subscribe({
        next: () => {
          this.obtenerCategorias();
          this.resetForm();
        },
        error: () => this.error = 'Error al actualizar categoría'
      });
    } else {
      this.foroService.crearCategoria(nombre).subscribe({
        next: () => {
          this.obtenerCategorias();
          this.resetForm();
        },
        error: () => this.error = 'Error al crear categoría'
      });
    }
  }

  editarCategoria(cat: CategoriaDTO) {
    this.modoEdicion = true;
    this.categoriaEditandoId = cat.id;
    this.categoriaForm.patchValue({ nombre: cat.nombre });
  }

  eliminarCategoria(id: number) {
    if (confirm('¿Estás seguro que deseas eliminar esta categoría?')) {
      this.foroService.eliminarCategoria(id).subscribe({
        next: () => this.obtenerCategorias(),
        error: () => this.error = 'Error al eliminar categoría'
      });
    }
  }

  resetForm() {
    this.categoriaForm.reset();
    this.modoEdicion = false;
    this.categoriaEditandoId = null;
  }
}
