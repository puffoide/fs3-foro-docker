import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDTO } from '../../../models/usuario.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let router: Router;

  const mockUser: UserDTO = {
    id: 1,
    username: 'adminUser',
    password: 'Password1!',
    role: 'ADMIN'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AutenticacionService', [
      'estaAutenticado',
      'obtenerUsuarioActivo',
      'logout'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule.withRoutes([]) // ✅ Importante para routerLink, ActivatedRoute, etc.
      ],
      providers: [
        { provide: AutenticacionService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // ✅ Espiar después de inyectar
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería retornar true en isLoggedIn si el usuario está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(true);
    expect(component.isLoggedIn).toBeTrue();
  });

  it('debería retornar el usuario actual con get user()', () => {
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);
    expect(component.user).toEqual(mockUser);
  });

  it('debería llamar logout() y redirigir al home', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
