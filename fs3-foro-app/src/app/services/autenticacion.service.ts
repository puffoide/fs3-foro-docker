import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { LoginDTO } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  // private apiUrl = 'http://localhost:8080/foro';
  private apiUrl = 'http://ip172-18-0-7-d0ghsvi91nsg008dtvi0-8080.direct.labs.play-with-docker.com/foro';
  private currentUser: UserDTO | null = null;

  constructor(private http: HttpClient) {
    this.cargarUsuarioDesdeStorage();
  }

  login(credentials: LoginDTO): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' }).subscribe({
        next: () => {
          this.obtenerUsuarioPorUsername(credentials.username).subscribe({
            next: user => {
              this.setCurrentUser(user);
              observer.next(user);
              observer.complete();
            },
            error: err => observer.error(err)
          });
        },
        error: err => observer.error(err)
      });
    });
  }

  register(data: UserDTO): Observable<UserDTO> {
  return new Observable(observer => {
    this.http.post<UserDTO>(`${this.apiUrl}/register`, data).subscribe({
      next: user => {
        this.setCurrentUser(user);
        observer.next(user);
        observer.complete();
      },
      error: err => observer.error(err)
    });
  });
}


  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    return new Observable(observer => {
      this.http.put<UserDTO>(`${this.apiUrl}/user/${id}`, user).subscribe({
        next: updatedUser => {
          if (this.getCurrentUser()?.id === updatedUser.id) {
            this.setCurrentUser(updatedUser);
          }
          observer.next(updatedUser);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  obtenerUsuarioPorUsername(username: string): Observable<UserDTO> {
    return new Observable(observer => {
      this.http.get<UserDTO[]>(`${this.apiUrl}/users`).subscribe({
        next: users => {
          const user = users.find(u => u.username === username);
          if (user) {
            observer.next(user);
          } else {
            observer.error('Usuario no encontrado');
          }
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }

  estaAutenticado(): boolean {
    return this.currentUser !== null;
  }

  obtenerUsuarioActivo(): UserDTO | null {
    return this.currentUser;
  }

  guardarUsuarioEnSesion(user: UserDTO): void {
    this.setCurrentUser(user);
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  private setCurrentUser(user: UserDTO): void {
    this.currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): UserDTO | null {
    return this.currentUser;
  }

  private cargarUsuarioDesdeStorage(): void {
    const data = localStorage.getItem('user');
    this.currentUser = data ? JSON.parse(data) : null;
  }

  obtenerTodosLosUsuarios() {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/users`);
  }

  eliminarUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }

}