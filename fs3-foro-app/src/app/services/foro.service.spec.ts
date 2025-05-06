import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForoService } from './foro.service';
import { PublicacionDTO } from '../models/publicacion.model';
import { ComentarioDTO } from '../models/comentario.model';
import { CategoriaDTO } from '../models/categoria.model';

describe('ForoService', () => {
  let service: ForoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/foro';

  const mockPub: PublicacionDTO = {
    id: 1,
    titulo: 'Título',
    contenido: 'Contenido',
    fechaCreacion: '2025-05-05T10:00:00',
    categoriaId: 1,
    usuarioId: 1,
    usuarioUsername: 'fsalgado'
  };

  const mockComentario: ComentarioDTO = {
    id: 1,
    contenido: 'Comentario prueba',
    fecha: '2025-05-05T11:00:00',
    publicacionId: 1,
    usuarioId: 1,
    username: 'fsalgado',
    rol: 'USER'
  };  

  const mockCategoria: CategoriaDTO = {
    id: 1,
    nombre: 'General'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForoService]
    });
    service = TestBed.inject(ForoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener todas las publicaciones', () => {
    service.getPublicaciones().subscribe(data => {
      expect(data).toEqual([mockPub]);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicaciones`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPub]);
  });

  it('debería obtener una publicación por id', () => {
    service.getPublicacion(1).subscribe(data => {
      expect(data).toEqual(mockPub);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicaciones/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPub);
  });

  it('debería crear una publicación', () => {
    service.crearPublicacion(mockPub).subscribe(data => {
      expect(data).toEqual(mockPub);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicaciones`);
    expect(req.request.method).toBe('POST');
    req.flush(mockPub);
  });

  it('debería editar una publicación', () => {
    service.editarPublicacion(mockPub).subscribe(data => {
      expect(data).toEqual(mockPub);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicaciones/${mockPub.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPub);
  });

  it('debería eliminar una publicación', () => {
    service.eliminarPublicacion(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/publicaciones/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería obtener comentarios por publicación', () => {
    service.getComentariosByPublicacion(1).subscribe(data => {
      expect(data).toEqual([mockComentario]);
    });

    const req = httpMock.expectOne(`${apiUrl}/comentarios/publicacion/1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockComentario]);
  });

  it('debería agregar un comentario', () => {
    const nuevoComentario = { ...mockComentario };
    delete nuevoComentario.id;

    service.agregarComentario(nuevoComentario).subscribe(data => {
      expect(data).toEqual(mockComentario);
    });

    const req = httpMock.expectOne(`${apiUrl}/comentarios`);
    expect(req.request.method).toBe('POST');
    req.flush(mockComentario);
  });

  it('debería editar un comentario', () => {
    service.editarComentario(1, mockComentario).subscribe(data => {
      expect(data).toEqual(mockComentario);
    });

    const req = httpMock.expectOne(`${apiUrl}/comentarios/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockComentario);
  });

  it('debería eliminar un comentario', () => {
    service.eliminarComentario(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/comentarios/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería obtener categorías', () => {
    service.obtenerCategorias().subscribe(data => {
      expect(data).toEqual([mockCategoria]);
    });

    const req = httpMock.expectOne(`${apiUrl}/categorias`);
    expect(req.request.method).toBe('GET');
    req.flush([mockCategoria]);
  });

  it('debería crear categoría', () => {
    service.crearCategoria('General').subscribe(data => {
      expect(data).toEqual(mockCategoria);
    });

    const req = httpMock.expectOne(`${apiUrl}/categorias`);
    expect(req.request.method).toBe('POST');
    req.flush(mockCategoria);
  });

  it('debería actualizar categoría', () => {
    service.actualizarCategoria(1, 'Actualizada').subscribe(data => {
      expect(data).toEqual(mockCategoria);
    });

    const req = httpMock.expectOne(`${apiUrl}/categorias/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockCategoria);
  });

  it('debería eliminar categoría', () => {
    service.eliminarCategoria(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/categorias/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
