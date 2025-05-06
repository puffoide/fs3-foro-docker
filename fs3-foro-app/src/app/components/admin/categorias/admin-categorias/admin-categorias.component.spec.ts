import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminCategoriasComponent } from './admin-categorias.component';
import { ForoService } from '../../../../services/foro.service';
import { of, throwError } from 'rxjs';
import { CategoriaDTO } from '../../../../models/categoria.model';
import { ReactiveFormsModule } from '@angular/forms';

describe('AdminCategoriasComponent', () => {
  let component: AdminCategoriasComponent;
  let fixture: ComponentFixture<AdminCategoriasComponent>;
  let foroServiceSpy: jasmine.SpyObj<ForoService>;

  const categoriasMock: CategoriaDTO[] = [
    { id: 1, nombre: 'Programación' },
    { id: 2, nombre: 'Diseño' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ForoService', [
      'obtenerCategorias',
      'crearCategoria',
      'actualizarCategoria',
      'eliminarCategoria'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminCategoriasComponent, ReactiveFormsModule],
      providers: [{ provide: ForoService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategoriasComponent);
    component = fixture.componentInstance;
    foroServiceSpy = TestBed.inject(ForoService) as jasmine.SpyObj<ForoService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener categorías correctamente', () => {
    foroServiceSpy.obtenerCategorias.and.returnValue(of(categoriasMock));
    component.ngOnInit();
    expect(component.categorias.length).toBe(2);
  });

  it('debería manejar error al obtener categorías', () => {
    foroServiceSpy.obtenerCategorias.and.returnValue(throwError(() => 'Error'));
    component.obtenerCategorias();
    expect(component.error).toBe('Error al cargar las categorías');
  });

  it('debería crear nueva categoría', () => {
    foroServiceSpy.crearCategoria.and.returnValue(of({}));
    foroServiceSpy.obtenerCategorias.and.returnValue(of([]));

    component.categoriaForm.setValue({ nombre: 'Nueva' });
    component.guardarCategoria();

    expect(foroServiceSpy.crearCategoria).toHaveBeenCalledWith('Nueva');
  });

  it('debería actualizar categoría existente', () => {
    foroServiceSpy.actualizarCategoria.and.returnValue(of({}));
    foroServiceSpy.obtenerCategorias.and.returnValue(of([]));

    component.modoEdicion = true;
    component.categoriaEditandoId = 1;
    component.categoriaForm.setValue({ nombre: 'Actualizada' });

    component.guardarCategoria();

    expect(foroServiceSpy.actualizarCategoria).toHaveBeenCalledWith(1, 'Actualizada');
  });

  it('debería eliminar categoría si se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    foroServiceSpy.eliminarCategoria.and.returnValue(of({}));
    foroServiceSpy.obtenerCategorias.and.returnValue(of([]));

    component.eliminarCategoria(1);
    expect(foroServiceSpy.eliminarCategoria).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar categoría si se cancela', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.eliminarCategoria(1);
    expect(foroServiceSpy.eliminarCategoria).not.toHaveBeenCalled();
  });

  it('debería cargar datos en modo edición al seleccionar editar', () => {
    const categoria = categoriasMock[0];
    component.editarCategoria(categoria);
    expect(component.modoEdicion).toBeTrue();
    expect(component.categoriaForm.value.nombre).toBe('Programación');
  });

  it('debería resetear el formulario correctamente', () => {
    component.modoEdicion = true;
    component.categoriaEditandoId = 2;
    component.categoriaForm.setValue({ nombre: 'Temporal' });

    component.resetForm();

    expect(component.modoEdicion).toBeFalse();
    expect(component.categoriaEditandoId).toBeNull();
    expect(component.categoriaForm.value.nombre).toBeFalsy();
  });
});
