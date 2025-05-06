import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { AutenticacionService } from '../../../services/autenticacion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDTO } from '../../../models/usuario.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AutenticacionService', ['estaAutenticado', 'obtenerUsuarioActivo']);
    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: () => '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        PerfilComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AutenticacionService, useValue: authSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
        // ❌ NO se provee Router aquí manualmente
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería redirigir al login si no está autenticado', () => {
    authServiceSpy.estaAutenticado.and.returnValue(false);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar el usuario si está autenticado', () => {
    const mockUser: UserDTO = {
      id: 1,
      username: 'usuarioTest',
      password: 'Password1!',
      role: 'USER'
    };

    authServiceSpy.estaAutenticado.and.returnValue(true);
    authServiceSpy.obtenerUsuarioActivo.and.returnValue(mockUser);

    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
    expect(component.loading).toBeFalse();
    expect(component.error).toBeFalse();
  });
});
