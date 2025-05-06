import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarPerfilComponent } from './editar-perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { UserDTO } from '../../../models/usuario.model';

describe('EditarPerfilComponent', () => {
  let component: EditarPerfilComponent;
  let fixture: ComponentFixture<EditarPerfilComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: UserDTO = {
    id: 1,
    username: 'usuarioTest',
    password: 'Password1!',
    role: 'USER'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AutenticacionService', [
      'estaAutenticado',
      'obtenerUsuarioActivo',
      'updateUser',
      'guardarUsuarioEnSesion'
    ]);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditarPerfilComponent, ReactiveFormsModule],
      providers: [
        { provide: AutenticacionService, useValue: authSpy },
        { provide: Router, useValue: routeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPerfilComponent);
    component = fixture.componentInstance;
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

  it('debería cargar datos del usuario si está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.form.value).toEqual({
      username: mockUser.username,
      password: mockUser.password,
      role: mockUser.role
    });
    expect(component.userId).toBe(mockUser.id);
  });

  it('no debería llamar a updateUser si el formulario es inválido', () => {
    component.form.setValue({ username: '', password: '', role: '' });
    component.guardarCambios();
    expect(authServiceSpy.updateUser).not.toHaveBeenCalled();
  });

  it('debería llamar a updateUser y redirigir si todo es válido', fakeAsync(() => {
    authServiceSpy.updateUser.and.returnValue(of({
      id: 1,
      username: 'usuarioTest',
      password: 'Password1!',
      role: 'USER'
    }));    
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);

    component.ngOnInit();
    component.guardarCambios();
    tick(1500);

    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(mockUser.id, jasmine.objectContaining({
      username: mockUser.username,
      password: mockUser.password,
      role: mockUser.role,
      id: mockUser.id
    }));

    expect(authServiceSpy.guardarUsuarioEnSesion).toHaveBeenCalled();
    expect(component.success).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/perfil']);
  }));

  it('debería mostrar error si falla updateUser', fakeAsync(() => {
    authServiceSpy.updateUser.and.returnValue(throwError(() => new Error('Error')));
    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);

    component.ngOnInit();
    component.guardarCambios();
    tick();

    expect(component.error).toBeTrue();
  }));
});
