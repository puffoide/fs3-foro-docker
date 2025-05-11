package com.fsalgado.foro.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fsalgado.foro.DTO.*;
import com.fsalgado.foro.enums.UserRole;
import com.fsalgado.foro.service.ForoService;
import com.fsalgado.foro.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ForoController.class)
class ForoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private ForoService foroService;

    private final ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());


    // === USUARIOS ===

    @Test
    void testGetAllUsers() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(new UserDTO(1L, "felipe", "1234", UserRole.USER)));

        mockMvc.perform(get("/foro/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username", is("felipe")));
    }

    @Test
    void testRegisterUser() throws Exception {
        UserDTO input = new UserDTO(null, "nuevo", "clave", UserRole.USER);
        UserDTO output = new UserDTO(1L, "nuevo", "clave", UserRole.USER);

        when(userService.createUser(any())).thenReturn(output);

        mockMvc.perform(post("/foro/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(input)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    void testLoginSuccess() throws Exception {
        when(userService.login("admin", "clave")).thenReturn(true);

        mockMvc.perform(post("/foro/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"clave\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Login exitoso"));
    }

    @Test
    void testLoginFail() throws Exception {
        when(userService.login("admin", "mal")).thenReturn(false);

        mockMvc.perform(post("/foro/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"admin\",\"password\":\"mal\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Credenciales inválidas"));
    }

    @Test
    void testDeleteUser() throws Exception {
        doNothing().when(userService).deleteUser(1L);

        mockMvc.perform(delete("/foro/user/1"))
                .andExpect(status().isNoContent());
    }

    // === CATEGORIAS ===

    @Test
    void testGetCategorias() throws Exception {
        when(foroService.getAllCategorias()).thenReturn(List.of(new CategoriaDTO(1L, "General")));

        mockMvc.perform(get("/foro/categorias"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre", is("General")));
    }

    @Test
    void testCreateCategoria() throws Exception {
        CategoriaDTO dto = new CategoriaDTO(null, "Novedades");
        when(foroService.addCategoria(any())).thenReturn(new CategoriaDTO(1L, "Novedades"));

        mockMvc.perform(post("/foro/categorias")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre", is("Novedades")));
    }

    // === PUBLICACIONES ===

    @Test
    void testGetPublicaciones() throws Exception {
        PublicacionDTO pub = new PublicacionDTO(1L, "Hola", "Contenido", LocalDateTime.now(), 1L, 2L, "felipe");
        when(foroService.getAllPublicaciones()).thenReturn(List.of(pub));

        mockMvc.perform(get("/foro/publicaciones"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].titulo", is("Hola")));
    }

    @Test
    void testGetPublicacionById_found() throws Exception {
        PublicacionDTO dto = new PublicacionDTO(1L, "Post", "Texto", LocalDateTime.now(), 1L, 2L, "felipe");
        when(foroService.getPublicacionById(1L)).thenReturn(Optional.of(dto));

        mockMvc.perform(get("/foro/publicaciones/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo", is("Post")));
    }

    @Test
    void testGetPublicacionById_notFound() throws Exception {
        when(foroService.getPublicacionById(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/foro/publicaciones/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeletePublicacion() throws Exception {
        doNothing().when(foroService).deletePublicacion(1L);

        mockMvc.perform(delete("/foro/publicaciones/1"))
                .andExpect(status().isNoContent());
    }

    // === COMENTARIOS ===

    @Test
    void testCreateComentario() throws Exception {
        ComentarioDTO dto = new ComentarioDTO(null, "Buen aporte", LocalDateTime.now(), 1L, 2L);
        ComentarioDTO response = new ComentarioDTO(1L, "Buen aporte", LocalDateTime.now(), 1L, 2L);

        when(foroService.addComentario(any())).thenReturn(response);

        mockMvc.perform(post("/foro/comentarios")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)));
    }

    @Test
    void testDeleteComentario() throws Exception {
        doNothing().when(foroService).deleteComentario(1L);

        mockMvc.perform(delete("/foro/comentarios/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testGetComentariosPorPublicacion() throws Exception {
        ComentarioDTO dto = new ComentarioDTO(1L, "Gracias!", LocalDateTime.now(), 1L, 2L, "felipe", "USER");
        when(foroService.getComentariosPorPublicacion(1L)).thenReturn(List.of(dto));

        mockMvc.perform(get("/foro/comentarios/publicacion/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].contenido", is("Gracias!")));
    }
}
