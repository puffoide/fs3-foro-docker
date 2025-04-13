package com.fsalgado.foro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fsalgado.foro.DTO.CategoriaDTO;
import com.fsalgado.foro.DTO.ComentarioDTO;
import com.fsalgado.foro.DTO.LoginDTO;
import com.fsalgado.foro.DTO.PublicacionDTO;
import com.fsalgado.foro.DTO.UserDTO;

import com.fsalgado.foro.service.ForoService;
import com.fsalgado.foro.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/foro")
public class ForoController {
    
    @Autowired
    private UserService userService;
    @Autowired
    private ForoService foroService;

    // Todo lo que es USUARIOS //

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public UserDTO register(@Valid @RequestBody UserDTO userDTO) {
        return userService.createUser(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO credentials) {
        boolean success = userService.login(credentials.getUsername(), credentials.getPassword());
        return success ? ResponseEntity.ok("Login exitoso") : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
    }

    @PutMapping("/user/{id}")
    public UserDTO updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    // Todo lo que es FORO //

     @GetMapping("/categorias")
    public List<CategoriaDTO> getCategorias() {
        return foroService.getAllCategorias();
    }

    @PostMapping("/categorias")
    public CategoriaDTO createCategoria(@RequestBody CategoriaDTO categoriaDTO) {
        return foroService.addCategoria(categoriaDTO);
    }

    @PutMapping("/categorias/{id}")
    public CategoriaDTO updateCategoria(@PathVariable Long id, @RequestBody CategoriaDTO categoriaDTO) {
        return foroService.updateCategoria(id, categoriaDTO);
    }

    @GetMapping("/publicaciones")
    public List<PublicacionDTO> getPublicaciones() {
        return foroService.getAllPublicaciones();
    }

    @PostMapping("/publicaciones")
    public PublicacionDTO createPublicacion(@RequestBody PublicacionDTO publicacionDTO) {
        return foroService.addPublicacion(publicacionDTO);
    }

    @PutMapping("/publicaciones/{id}")
    public PublicacionDTO updatePublicacion(@PathVariable Long id, @RequestBody PublicacionDTO publicacionDTO) {
        return foroService.updatePublicacion(id, publicacionDTO);
    }

    @DeleteMapping("/publicaciones/{id}")
    public ResponseEntity<Void> deletePublicacion(@PathVariable Long id) {
        foroService.deletePublicacion(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/comentarios")
    public ComentarioDTO createComentario(@RequestBody ComentarioDTO comentarioDTO) {
        return foroService.addComentario(comentarioDTO);
    }

    @PutMapping("/comentarios/{id}")
    public ComentarioDTO updateComentario(@PathVariable Long id, @RequestBody ComentarioDTO comentarioDTO) {
        return foroService.updateComentario(id, comentarioDTO);
    }

    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<Void> deleteComentario(@PathVariable Long id) {
        foroService.deleteComentario(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/comentarios/publicacion/{publicacionId}")
    public List<ComentarioDTO> getComentariosPorPublicacion(@PathVariable Long publicacionId) {
        return foroService.getComentariosPorPublicacion(publicacionId);
    }

}
