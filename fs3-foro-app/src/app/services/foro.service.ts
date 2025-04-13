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

  private apiUrl = 'http://localhost:8080/foro';

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
  
  agregarComentario(comentario: ComentarioDTO): Observable<ComentarioDTO> {
    return this.http.post<ComentarioDTO>(`${this.apiUrl}/comentarios`, comentario);
  }

  getCategorias(): Observable<CategoriaDTO[]> {
    return this.http.get<CategoriaDTO[]>(`${this.apiUrl}/categorias`);
  }
  
  crearPublicacion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicaciones`, data);
  }
  
  
  
}
