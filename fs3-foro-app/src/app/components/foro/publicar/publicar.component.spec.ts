import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PublicarComponent } from './publicar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ForoService } from '../../../services/foro.service';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CategoriaDTO } from '../../../models/categoria.model';
import { FormsModule } from '@angular/forms';

describe('PublicarComponent', () => {
  let component: PublicarComponent;
  let fixture: ComponentFixture<PublicarComponent>;
  let foroServiceSpy: jasmine.SpyObj<ForoService>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCategorias: CategoriaDTO[] = [
    { id: 1, nombre: 'General' },
    { id: 2, nombre: 'Noticias' }
  ];

  const mockUser = {
    id: 99,
    username: 'fsalgado',
    password: 'Password123!',
    role: 'USER'
  };

  beforeEach(async () => {
    foroServiceSpy = jasmine.createSpyObj('ForoService', ['obtenerCategorias', 'crearPublicacion']);
    authServiceSpy = jasmine.createSpyObj('AutenticacionService', ['estaAutenticado', 'obtenerUsuarioActivo']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PublicarComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ForoService, useValue: foroServiceSpy },
        { provide: AutenticacionService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicarComponent);
    component = fixture.componentInstance;
  });

  it('debería redirigir al login si no está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(false);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar categorías si está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    foroServiceSpy.obtenerCategorias.and.returnValue(of(mockCategorias));

    component.ngOnInit();

    expect(component.categorias.length).toBe(2);
    expect(foroServiceSpy.obtenerCategorias).toHaveBeenCalled();
  });

  it('no debería publicar si el formulario es inválido', () => {
    component.publicar();
    expect(foroServiceSpy.crearPublicacion).not.toHaveBeenCalled();
  });

  it('debería mostrar error si no hay usuario activo', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(null);

    component.form.setValue({
      titulo: 'Título válido',
      contenido: 'Contenido válido más largo',
      categoriaId: 1
    });

    component.publicar();
    expect(foroServiceSpy.crearPublicacion).not.toHaveBeenCalled();
  });

  it('debería crear una publicación válida y redirigir al foro', fakeAsync(() => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);
    foroServiceSpy.crearPublicacion.and.returnValue(of({}));

    component.form.setValue({
      titulo: 'Post de prueba',
      contenido: 'Contenido largo válido',
      categoriaId: 1
    });

    component.publicar();
    expect(component.success).toBeTrue();
    tick(1500);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/foro']);
  }));

  it('debería mostrar alerta si falla la carga de categorías', () => {
    spyOn(window, 'alert');
    authServiceSpy.estaAutenticado.and.returnValue(true);
    foroServiceSpy.obtenerCategorias.and.returnValue(throwError(() => new Error('Error de red')));

    component.ngOnInit();

    expect(window.alert).toHaveBeenCalledWith('Error al cargar categorías');
  });

  it('debería mostrar alerta si falla la publicación', () => {
    spyOn(window, 'alert');
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);
    foroServiceSpy.crearPublicacion.and.returnValue(throwError(() => new Error('Error')));

    component.form.setValue({
      titulo: 'Post válido',
      contenido: 'Contenido válido',
      categoriaId: 1
    });

    component.publicar();

    expect(window.alert).toHaveBeenCalledWith('Error al publicar');
  });
});
