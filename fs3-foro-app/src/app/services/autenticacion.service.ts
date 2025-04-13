import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from '../models/usuario.model';
import { Observable } from 'rxjs';
import { LoginDTO } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})

export class AutenticacionService {

  private apiUrl = 'http://localhost:8080/foro';

  constructor(private http: HttpClient) {}

  login(credentials: LoginDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { responseType: 'text' });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  
  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiUrl}/user/${id}`);
  }

  updateUser(id: number, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.apiUrl}/user/${id}`, user);
  }
  

}
