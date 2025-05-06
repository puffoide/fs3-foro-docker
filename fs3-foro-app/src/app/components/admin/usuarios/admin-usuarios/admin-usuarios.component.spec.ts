import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { AutenticacionService } from '../../../../services/autenticacion.service';
import { of, throwError } from 'rxjs';
import { UserDTO } from '../../../../models/usuario.model';

describe('AdminUsuariosComponent', () => {
  let component: AdminUsuariosComponent;
  let fixture: ComponentFixture<AdminUsuariosComponent>;
  let authServiceSpy: jasmine.SpyObj<AutenticacionService>;

  const mockUsuarios: UserDTO[] = [
    { id: 1, username: 'admin', password: '1234', role: 'ADMIN' },
    { id: 2, username: 'user', password: 'abcd', role: 'USER' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AutenticacionService', [
      'obtenerTodosLosUsuarios',
      'eliminarUsuario'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminUsuariosComponent],
      providers: [
        { provide: AutenticacionService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsuariosComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AutenticacionService) as jasmine.SpyObj<AutenticacionService>;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los usuarios correctamente', () => {
    authServiceSpy.obtenerTodosLosUsuarios.and.returnValue(of(mockUsuarios));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.usuarios.length).toBe(2);
    expect(component.usuarios[0].username).toBe('admin');
  });

  it('debería manejar error al cargar usuarios', () => {
    authServiceSpy.obtenerTodosLosUsuarios.and.returnValue(throwError(() => 'Error'));
    component.ngOnInit();
    expect(component.error).toBe('No se pudieron cargar los usuarios');
    expect(component.loading).toBeFalse();
  });

  it('debería eliminar usuario correctamente', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    authServiceSpy.eliminarUsuario.and.returnValue(of({}));
    component.usuarios = [...mockUsuarios];

    component.eliminarUsuario(1);
    tick();

    expect(component.usuarios.length).toBe(1);
    expect(component.usuarios[0].id).toBe(2);
  }));

  it('no debería eliminar si se cancela el confirm', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.usuarios = [...mockUsuarios];
    component.eliminarUsuario(1);
    expect(authServiceSpy.eliminarUsuario).not.toHaveBeenCalled();
  });
});
