package com.fsalgado.foro.service;

import com.fsalgado.foro.DTO.CategoriaDTO;
import com.fsalgado.foro.DTO.ComentarioDTO;
import com.fsalgado.foro.DTO.PublicacionDTO;
import com.fsalgado.foro.enums.UserRole;
import com.fsalgado.foro.model.Categoria;
import com.fsalgado.foro.model.Comentario;
import com.fsalgado.foro.model.Publicacion;
import com.fsalgado.foro.model.User;
import com.fsalgado.foro.repository.CategoriaRepository;
import com.fsalgado.foro.repository.ComentarioRepository;
import com.fsalgado.foro.repository.PublicacionRepository;
import com.fsalgado.foro.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class ForoServiceTest {

    @InjectMocks
    private ForoService foroService;

    @Mock
    private CategoriaRepository categoriaRepo;
    @Mock
    private PublicacionRepository publicacionRepo;
    @Mock
    private ComentarioRepository comentarioRepo;
    @Mock
    private UserRepository userRepo;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllCategorias() {
        Categoria cat = new Categoria();
        cat.setId(1L);
        cat.setNombre("General");

        when(categoriaRepo.findAll()).thenReturn(List.of(cat));

        List<CategoriaDTO> result = foroService.getAllCategorias();

        assertEquals(1, result.size());
        assertEquals("General", result.get(0).getNombre());
    }

    @Test
    void testAddCategoria() {
        Categoria c = new Categoria();
        c.setId(1L);
        c.setNombre("Novedades");

        when(categoriaRepo.save(any(Categoria.class))).thenReturn(c);

        CategoriaDTO dto = new CategoriaDTO(null, "Novedades");
        CategoriaDTO result = foroService.addCategoria(dto);

        assertNotNull(result.getId());
        assertEquals("Novedades", result.getNombre());
        verify(categoriaRepo).save(any(Categoria.class));
    }

    @Test
    void testUpdateCategoria_found() {
        Categoria existing = new Categoria();
        existing.setId(1L);
        existing.setNombre("Antiguo");

        when(categoriaRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(categoriaRepo.save(any(Categoria.class))).thenAnswer(inv -> inv.getArgument(0));

        CategoriaDTO dto = new CategoriaDTO(null, "NuevoNombre");
        CategoriaDTO result = foroService.updateCategoria(1L, dto);

        assertEquals("NuevoNombre", result.getNombre());
    }

    @Test
    void testUpdateCategoria_notFound() {
        when(categoriaRepo.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
            foroService.updateCategoria(99L, new CategoriaDTO(null, "X"))
        );

        assertEquals("Categoría no encontrada", ex.getMessage());
    }

     @Test
    void testGetAllPublicaciones() {
        Categoria cat = new Categoria(); cat.setId(1L);
        User user = new User(); user.setId(2L); user.setUsername("felipe");

        Publicacion pub = new Publicacion();
        pub.setId(1L); pub.setTitulo("Título"); pub.setContenido("Contenido");
        pub.setFechaCreacion(LocalDateTime.now());
        pub.setCategoria(cat); pub.setUsuario(user);

        when(publicacionRepo.findAll()).thenReturn(List.of(pub));

        List<PublicacionDTO> result = foroService.getAllPublicaciones();
        assertEquals(1, result.size());
        assertEquals("Título", result.get(0).getTitulo());
    }

    @Test
    void testAddPublicacion() {
        Publicacion pub = new Publicacion();
        pub.setId(1L);
        Categoria cat = new Categoria(); cat.setId(1L);
        User user = new User(); user.setId(2L); user.setUsername("felipe");
        pub.setCategoria(cat); pub.setUsuario(user);

        when(publicacionRepo.save(any())).thenReturn(pub);

        PublicacionDTO dto = new PublicacionDTO(null, "Nuevo", "Texto", LocalDateTime.now(), 1L, 2L, null);
        PublicacionDTO result = foroService.addPublicacion(dto);

        assertNotNull(result.getId());
        verify(publicacionRepo).save(any());
    }

    @Test
    void testUpdatePublicacion_found() {
        Publicacion existing = new Publicacion();
        existing.setId(1L);

        when(publicacionRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(publicacionRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        PublicacionDTO dto = new PublicacionDTO(null, "Editado", "Contenido", LocalDateTime.now(), 1L, 2L, null);
        PublicacionDTO result = foroService.updatePublicacion(1L, dto);

        assertEquals("Editado", result.getTitulo());
    }

    @Test
    void testUpdatePublicacion_notFound() {
        when(publicacionRepo.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                foroService.updatePublicacion(1L, new PublicacionDTO()));
    }

    @Test
    void testDeletePublicacion_found() {
        Publicacion pub = new Publicacion(); pub.setId(1L);
        when(publicacionRepo.findById(1L)).thenReturn(Optional.of(pub));

        foroService.deletePublicacion(1L);

        verify(publicacionRepo).delete(pub);
    }

    @Test
    void testDeletePublicacion_notFound() {
        when(publicacionRepo.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> foroService.deletePublicacion(1L));
    }

    @Test
    void testGetPublicacionById_found() {
        Publicacion p = new Publicacion();
        p.setId(1L);
        p.setTitulo("Post");
        Categoria c = new Categoria(); c.setId(1L);
        User u = new User(); u.setId(2L); u.setUsername("felipe");
        p.setCategoria(c); p.setUsuario(u);

        when(publicacionRepo.findById(1L)).thenReturn(Optional.of(p));

        Optional<PublicacionDTO> result = foroService.getPublicacionById(1L);

        assertTrue(result.isPresent());
        assertEquals("Post", result.get().getTitulo());
    }

    @Test
    void testAddComentario() {
        Comentario comentario = new Comentario();
        comentario.setId(1L);
        Publicacion p = new Publicacion(); p.setId(1L);
        User u = new User(); u.setId(2L);
        comentario.setPublicacion(p); comentario.setUsuario(u);

        when(comentarioRepo.save(any())).thenReturn(comentario);

        ComentarioDTO dto = new ComentarioDTO(null, "Buen post", LocalDateTime.now(), 1L, 2L);
        ComentarioDTO result = foroService.addComentario(dto);

        assertNotNull(result.getId());
        verify(comentarioRepo).save(any());
    }

    @Test
    void testUpdateComentario_found() {
        Comentario existing = new Comentario();
        existing.setId(1L);
        Publicacion p = new Publicacion(); p.setId(1L);
        User u = new User(); u.setId(2L); u.setUsername("felipe"); u.setRole(UserRole.USER);
        existing.setPublicacion(p); existing.setUsuario(u);

        when(comentarioRepo.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepo.findById(2L)).thenReturn(Optional.of(u));
        when(comentarioRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        ComentarioDTO dto = new ComentarioDTO(null, "Editado", LocalDateTime.now(), 1L, 2L);
        ComentarioDTO result = foroService.updateComentario(1L, dto);

        assertEquals("Editado", result.getContenido());
        assertEquals("felipe", result.getUsername());
    }

    @Test
    void testUpdateComentario_notFound() {
        when(comentarioRepo.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                foroService.updateComentario(1L, new ComentarioDTO()));
    }

    @Test
    void testGetComentariosPorPublicacion() {
        Comentario c = new Comentario();
        c.setId(1L);
        c.setContenido("Texto");
        c.setFecha(LocalDateTime.now());
        Publicacion p = new Publicacion(); p.setId(1L);
        User u = new User(); u.setId(2L); u.setUsername("felipe"); u.setRole(UserRole.ADMIN);
        c.setPublicacion(p); c.setUsuario(u);

        when(comentarioRepo.findAll()).thenReturn(List.of(c));

        List<ComentarioDTO> result = foroService.getComentariosPorPublicacion(1L);

        assertEquals(1, result.size());
        assertEquals("Texto", result.get(0).getContenido());
        assertEquals("felipe", result.get(0).getUsername());
    }

    @Test
    void testDeleteComentario() {
        foroService.deleteComentario(1L);
        verify(comentarioRepo).deleteById(1L);
    }

}
