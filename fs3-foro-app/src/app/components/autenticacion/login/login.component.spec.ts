import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

// Dummy para la ruta '/foro'
@Component({ template: '' })
class DummyComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AutenticacionService', ['login']);
    const activatedRouteStub = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'foro', component: DummyComponent }
        ])
      ],
      declarations: [DummyComponent],
      providers: [
        FormBuilder,
        { provide: AutenticacionService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario inválido si los campos están vacíos', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('no debería intentar login si el formulario es inválido', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.submitted).toBeTrue();
  });

  it('debería llamar a login y navegar si las credenciales son correctas', fakeAsync(() => {
    const mockCredentials = { username: 'usuario', password: '1234' };
    component.loginForm.setValue(mockCredentials);
    authServiceSpy.login.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockCredentials);
    expect(component.loginError).toBeNull();
  }));

  it('debería mostrar error si el login falla', fakeAsync(() => {
    const mockCredentials = { username: 'usuario', password: 'mal' };
    component.loginForm.setValue(mockCredentials);
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Credenciales inválidas')));

    component.onSubmit();
    tick();

    expect(authServiceSpy.login).toHaveBeenCalledWith(mockCredentials);
    expect(component.loginError).toBe('Credenciales inválidas');
  }));
});
