import { TestBed } from '@angular/core/testing';
import { AutenticacionService } from './autenticacion.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserDTO } from '../models/usuario.model';
import { LoginDTO } from '../models/login.model';

describe('AutenticacionService', () => {
  let service: AutenticacionService;
  let httpMock: HttpTestingController;

  const mockUser: UserDTO = {
    id: 1,
    username: 'usuarioTest',
    password: 'Password1!',
    role: 'USER'
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AutenticacionService]
    });

    service = TestBed.inject(AutenticacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer login y obtener usuario', (done) => {
    const credentials: LoginDTO = { username: mockUser.username, password: 'Password1!' };

    service.login(credentials).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
      done();
    });

    const loginReq = httpMock.expectOne('http://localhost:8080/foro/login');
    expect(loginReq.request.method).toBe('POST');
    loginReq.flush('OK');

    const usersReq = httpMock.expectOne('http://localhost:8080/foro/users');
    expect(usersReq.request.method).toBe('GET');
    usersReq.flush([mockUser]);
  });

  it('debería registrar un usuario y guardarlo en sesión', (done) => {
    service.register(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
      expect(service.getCurrentUser()).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/foro/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('debería actualizar el usuario y actualizar el actual si el ID coincide', (done) => {
    service.guardarUsuarioEnSesion(mockUser);

    const updatedUser = { ...mockUser, username: 'nuevoNombre' };

    service.updateUser(mockUser.id, updatedUser).subscribe(user => {
      expect(user.username).toBe('nuevoNombre');
      expect(service.getCurrentUser()?.username).toBe('nuevoNombre');
      done();
    });

    const req = httpMock.expectOne(`http://localhost:8080/foro/user/${mockUser.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedUser);
  });

  it('debería obtener usuario por username si existe', (done) => {
    service.obtenerUsuarioPorUsername(mockUser.username).subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/foro/users');
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('estaAutenticado() debe retornar true si hay usuario activo', () => {
    service.guardarUsuarioEnSesion(mockUser);
    expect(service.estaAutenticado()).toBeTrue();
  });

  it('logout() debe limpiar el usuario y el localStorage', () => {
    service.guardarUsuarioEnSesion(mockUser);
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
