import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AutenticacionService', ['register']);
    const activatedRouteStub = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]) 
      ],
      providers: [
        { provide: AutenticacionService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario inválido si los campos están vacíos o incorrectos', () => {
    component.registerForm.setValue({ username: '', password: '', role: '' });
    expect(component.registerForm.invalid).toBeTrue();
  });

  it('no debería registrar si el formulario es inválido', () => {
    component.registerForm.setValue({ username: '', password: '', role: '' });
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
  });

  it('debería registrar correctamente si el formulario es válido', fakeAsync(() => {
    const mockUsuario = {
      username: 'UsuarioTest',
      password: 'Password1!',
      role: 'USER'
    };

    authServiceSpy.register.and.returnValue(of({
      id: 1,
      username: 'UsuarioTest',
      password: 'Password1!',
      role: 'USER'
    }));

    component.registerForm.setValue(mockUsuario);
    component.onSubmit();
    tick(1500);

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(component.registroExitoso).toBeTrue();
    expect(component.registroError).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('debería mostrar mensaje de error si falla el registro', fakeAsync(() => {
    const mockUsuario = {
      username: 'UsuarioTest',
      password: 'Password1!',
      role: 'USER'
    };

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Error')));

    component.registerForm.setValue(mockUsuario);
    component.onSubmit();
    tick();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(component.registroError).toBeTrue();
    expect(component.mensajeError).toBe('Error al registrar el usuario.');
  }));
});
