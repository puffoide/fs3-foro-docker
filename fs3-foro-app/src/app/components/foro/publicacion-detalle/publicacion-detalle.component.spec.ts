import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionDetalleComponent } from './publicacion-detalle.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ForoService } from '../../../services/foro.service';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('PublicacionDetalleComponent', () => {
  let component: PublicacionDetalleComponent;
  let fixture: ComponentFixture<PublicacionDetalleComponent>;
  let foroServiceSpy: jasmine.SpyObj<ForoService>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPublicacion = {
    id: 1,
    titulo: 'Título de prueba',
    contenido: 'Contenido de prueba',
    fechaCreacion: '2025-05-01T10:00:00',
    categoriaId: 1,
    usuarioId: 99,
    usuarioUsername: 'fsalgado'
  };

  const mockComentario = {
    id: 1,
    contenido: 'Comentario',
    fecha: '2025-05-05T11:00:00',
    publicacionId: 1,
    usuarioId: 99,
    username: 'fsalgado',
    rol: 'USER'
  };

  const mockUsuario = {
    id: 99,
    username: 'fsalgado',
    password: 'Password123!',
    role: 'USER'
  };

  beforeEach(async () => {
    foroServiceSpy = jasmine.createSpyObj('ForoService', [
      'getPublicacion',
      'getComentariosByPublicacion',
      'agregarComentario',
      'editarComentario',
      'eliminarComentario',
      'editarPublicacion',
      'eliminarPublicacion'
    ]);
    authServiceSpy = jasmine.createSpyObj('AutenticacionService', ['estaAutenticado', 'obtenerUsuarioActivo']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PublicacionDetalleComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ForoService, useValue: foroServiceSpy },
        { provide: AutenticacionService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map().set('id', '1') }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUsuario);
    foroServiceSpy.getPublicacion.and.returnValue(of(mockPublicacion));
    foroServiceSpy.getComentariosByPublicacion.and.returnValue(of([mockComentario]));

    fixture = TestBed.createComponent(PublicacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería cargar la publicación y los comentarios', () => {
    expect(component.publicacion?.id).toBe(1);
    expect(component.comentarios.length).toBe(1);
    expect(foroServiceSpy.getPublicacion).toHaveBeenCalled();
    expect(foroServiceSpy.getComentariosByPublicacion).toHaveBeenCalled();
  });

  it('debería agregar un comentario válido', () => {
    component.comentarioForm.setValue({ contenido: 'Nuevo comentario', usuarioId: mockUsuario.id });
    foroServiceSpy.agregarComentario.and.returnValue(of(mockComentario));

    component.enviarComentario();

    expect(foroServiceSpy.agregarComentario).toHaveBeenCalled();
    expect(component.comentarios.length).toBeGreaterThan(1);
  });

  it('no debería agregar comentario si el formulario es inválido', () => {
    component.comentarioForm.setValue({ contenido: '', usuarioId: mockUsuario.id });

    component.enviarComentario();

    expect(foroServiceSpy.agregarComentario).not.toHaveBeenCalled();
  });

  it('debería guardar edición del comentario', () => {
    const editable = { ...mockComentario, editando: true };
    foroServiceSpy.editarComentario.and.returnValue(of(mockComentario));

    component.guardarComentario(editable);
    expect(foroServiceSpy.editarComentario).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('debería eliminar un comentario', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    foroServiceSpy.eliminarComentario.and.returnValue(of(undefined));

    component.eliminarComentario(1);

    expect(foroServiceSpy.eliminarComentario).toHaveBeenCalledWith(1);
    expect(component.comentarios.find(c => c.id === 1)).toBeUndefined();
  });

  it('debería editar y guardar una publicación', () => {
    component.publicacionForm.setValue({
      titulo: 'Título actualizado',
      contenido: 'Contenido actualizado'
    });

    foroServiceSpy.editarPublicacion.and.returnValue(of(mockPublicacion));
    component.publicacion = mockPublicacion;
    component.guardarEdicionPublicacion();

    expect(foroServiceSpy.editarPublicacion).toHaveBeenCalled();
    expect(component.modoEdicionPublicacion).toBeFalse();
  });

  it('debería eliminar la publicación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    foroServiceSpy.eliminarPublicacion.and.returnValue(of(undefined));
    component.publicacion = mockPublicacion;

    component.eliminarPublicacion();

    expect(foroServiceSpy.eliminarPublicacion).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/foro']);
  });

  it('debería retornar verdadero si puede editar la publicación', () => {
    authServiceSpy.obtenerUsuarioActivo.and.returnValue({ ...mockUsuario, role: 'ADMIN' });
    expect(component.puedeEditarPublicacion()).toBeTrue();
  });

  it('debería retornar falso si el usuario no es admin', () => {
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUsuario);
    expect(component.puedeEditarPublicacion()).toBeFalse();
  });
});
