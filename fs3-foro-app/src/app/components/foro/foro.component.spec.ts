import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForoComponent } from './foro.component';
import { of, throwError } from 'rxjs';
import { ForoService } from '../../services/foro.service';
import { AutenticacionService } from '../../services/autenticacion.service';
import { Router } from '@angular/router';
import { PublicacionDTO } from '../../models/publicacion.model';

describe('ForoComponent', () => {
  let component: ForoComponent;
  let fixture: ComponentFixture<ForoComponent>;
  let foroServiceSpy: jasmine.SpyObj<ForoService>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const foroSpy = jasmine.createSpyObj('ForoService', ['getPublicaciones']);
    const authSpy = jasmine.createSpyObj('AutenticacionService', ['estaAutenticado']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForoComponent],
      providers: [
        { provide: ForoService, useValue: foroSpy },
        { provide: AutenticacionService, useValue: authSpy },
        { provide: Router, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForoComponent);
    component = fixture.componentInstance;
    foroServiceSpy = TestBed.inject(ForoService) as jasmine.SpyObj<ForoService>;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería redirigir al login si no está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(false);

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar publicaciones si el usuario está autenticado', () => {
    const mockData: PublicacionDTO[] = [
      {
        id: 1,
        titulo: 'Títuloooooooo',
        contenido: 'Contenido largo............',
        usuarioUsername: 'usuario1',
        fechaCreacion: '2025-05-05T12:00:00',
        categoriaId: 1,
        usuarioId: 10
      }      
    ];
    authServiceSpy.estaAutenticado.and.returnValue(true);
    foroServiceSpy.getPublicaciones.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.publicaciones).toEqual(mockData);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });

  it('debería manejar error al cargar publicaciones', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    foroServiceSpy.getPublicaciones.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.error).toBeTrue();
    expect(component.loading).toBeFalse();
  });

  it('debería navegar al detalle de una publicación', () => {
    component.irADetalle(123);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/publicacion', 123]);
  });
});
