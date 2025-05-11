import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicacionDTO } from '../models/publicacion.model';
import { ComentarioDTO } from '../models/comentario.model';
import { CategoriaDTO } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class ForoService {

  // private apiUrl = 'http://localhost:8080/foro';
  private apiUrl = 'http://ip172-18-0-7-d0ghsvi91nsg008dtvi0-8080.direct.labs.play-with-docker.com/foro';

  constructor(private http: HttpClient) {}

  getPublicaciones(): Observable<PublicacionDTO[]> {
    return this.http.get<PublicacionDTO[]>(`${this.apiUrl}/publicaciones`);
  }

  getPublicacion(id: number): Observable<PublicacionDTO> {
    return this.http.get<PublicacionDTO>(`${this.apiUrl}/publicaciones/${id}`);
  }
  
  getComentariosByPublicacion(publicacionId: number): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(`${this.apiUrl}/comentarios/publicacion/${publicacionId}`);
  }
  
  agregarComentario(comentario: Omit<ComentarioDTO, 'id'>): Observable<ComentarioDTO> {
    return this.http.post<ComentarioDTO>(`${this.apiUrl}/comentarios`, comentario);
  }  
  
  crearPublicacion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicaciones`, data);
  }

  editarPublicacion(pub: PublicacionDTO): Observable<PublicacionDTO> {
    return this.http.put<PublicacionDTO>(`${this.apiUrl}/publicaciones/${pub.id}`, pub);
  }
  
  eliminarPublicacion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/publicaciones/${id}`);
  }  
  
  obtenerCategorias() {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias`);
  }
  
  crearCategoria(nombre: string) {
    return this.http.post(`${this.apiUrl}/categorias`, { nombre });
  }
  
  actualizarCategoria(id: number, nombre: string) {
    return this.http.put(`${this.apiUrl}/categorias/${id}`, { nombre });
  }
  
  eliminarCategoria(id: number) {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`);
  }

  editarComentario(id: number, comentario: ComentarioDTO) {
    return this.http.put<ComentarioDTO>(`${this.apiUrl}/comentarios/${id}`, comentario);
  }
  
  eliminarComentario(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/comentarios/${id}`);
  }
  
  
}
