package com.fsalgado.foro.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fsalgado.foro.DTO.CategoriaDTO;
import com.fsalgado.foro.DTO.ComentarioDTO;
import com.fsalgado.foro.DTO.PublicacionDTO;
import com.fsalgado.foro.model.Categoria;
import com.fsalgado.foro.model.Comentario;
import com.fsalgado.foro.model.Publicacion;
import com.fsalgado.foro.model.User;
import com.fsalgado.foro.repository.CategoriaRepository;
import com.fsalgado.foro.repository.ComentarioRepository;
import com.fsalgado.foro.repository.PublicacionRepository;
import com.fsalgado.foro.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class ForoService {

    @Autowired
    private CategoriaRepository categoriaRepo;
    @Autowired
    private PublicacionRepository publicacionRepo;
    @Autowired
    private ComentarioRepository comentarioRepo;
    @Autowired
    private UserRepository userRepo;


    public List<CategoriaDTO> getAllCategorias() {
        return categoriaRepo.findAll().stream()
                .map(cat -> new CategoriaDTO(cat.getId(), cat.getNombre()))
                .collect(Collectors.toList());
    }

    public CategoriaDTO addCategoria(CategoriaDTO dto) {
        Categoria c = new Categoria();
        c.setNombre(dto.getNombre());
        Categoria saved = categoriaRepo.save(c);
        return new CategoriaDTO(saved.getId(), saved.getNombre());
    }

    public CategoriaDTO updateCategoria(Long id, CategoriaDTO dto) {
        return categoriaRepo.findById(id).map(cat -> {
            cat.setNombre(dto.getNombre());
            Categoria updated = categoriaRepo.save(cat);
            return new CategoriaDTO(updated.getId(), updated.getNombre());
        }).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
    }

    public List<PublicacionDTO> getAllPublicaciones() {
        return publicacionRepo.findAll().stream()
                .map(p -> new PublicacionDTO(
                        p.getId(),
                        p.getTitulo(),
                        p.getContenido(),
                        p.getFechaCreacion(),
                        p.getCategoria().getId(),
                        p.getUsuario().getId(),
                        p.getUsuario().getUsername()
                )).collect(Collectors.toList());
    }

    public PublicacionDTO addPublicacion(PublicacionDTO dto) {
        Publicacion p = new Publicacion();
        p.setTitulo(dto.getTitulo());
        p.setContenido(dto.getContenido());
        p.setFechaCreacion(dto.getFechaCreacion());

        Categoria cat = new Categoria();
        cat.setId(dto.getCategoriaId());
        p.setCategoria(cat);

        User user = new User();
        user.setId(dto.getUsuarioId());
        p.setUsuario(user);

        Publicacion saved = publicacionRepo.save(p);
        return new PublicacionDTO(saved.getId(), saved.getTitulo(), saved.getContenido(), saved.getFechaCreacion(), saved.getCategoria().getId(), saved.getUsuario().getId(), saved.getUsuario().getUsername());
    }

    public PublicacionDTO updatePublicacion(Long id, PublicacionDTO dto) {
        return publicacionRepo.findById(id).map(p -> {
            p.setTitulo(dto.getTitulo());
            p.setContenido(dto.getContenido());
            p.setFechaCreacion(dto.getFechaCreacion());

            Categoria cat = new Categoria();
            cat.setId(dto.getCategoriaId());
            p.setCategoria(cat);

            User user = new User();
            user.setId(dto.getUsuarioId());
            p.setUsuario(user);

            Publicacion updated = publicacionRepo.save(p);
            return new PublicacionDTO(updated.getId(), updated.getTitulo(), updated.getContenido(), updated.getFechaCreacion(), updated.getCategoria().getId(), updated.getUsuario().getId(), updated.getUsuario().getUsername());
        }).orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
    }

    @Transactional
    public void deletePublicacion(Long id) {
        Optional<Publicacion> pubOpt = publicacionRepo.findById(id);
        if (pubOpt.isPresent()) {
            publicacionRepo.delete(pubOpt.get());
        } else {
            throw new EntityNotFoundException("Publicación no encontrada con ID: " + id);
        }
    }

    public ComentarioDTO addComentario(ComentarioDTO dto) {
        Comentario c = new Comentario();
        c.setContenido(dto.getContenido());
        c.setFecha(dto.getFecha());

        Publicacion p = new Publicacion();
        p.setId(dto.getPublicacionId());
        c.setPublicacion(p);

        User u = new User();
        u.setId(dto.getUsuarioId());
        c.setUsuario(u);

        Comentario saved = comentarioRepo.save(c);
        return new ComentarioDTO(saved.getId(), saved.getContenido(), saved.getFechaTime(), saved.getPublicacion().getId(), saved.getUsuario().getId());
    }

    public ComentarioDTO updateComentario(Long id, ComentarioDTO dto) {
        return comentarioRepo.findById(id).map(c -> {
            c.setContenido(dto.getContenido());
            c.setFecha(dto.getFecha());

            Publicacion p = new Publicacion();
            p.setId(dto.getPublicacionId());
            c.setPublicacion(p);

            User u = userRepo.findById(dto.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            c.setUsuario(u);

            Comentario updated = comentarioRepo.save(c);
            return new ComentarioDTO(updated.getId(), updated.getContenido(), updated.getFechaTime(), updated.getPublicacion().getId(), u.getId(), u.getUsername(), u.getRole().name());
        }).orElseThrow(() -> new RuntimeException("Comentario no encontrado"));
    }

    public List<ComentarioDTO> getComentariosPorPublicacion(Long publicacionId) {
        return comentarioRepo.findAll().stream()
                .filter(c -> c.getPublicacion().getId().equals(publicacionId))
                .map(c -> new ComentarioDTO(
                c.getId(),
                c.getContenido(),
                c.getFechaTime(),
                c.getPublicacion().getId(),
                c.getUsuario().getId(),
                c.getUsuario().getUsername(),
                c.getUsuario().getRole().name()
            ))
                .collect(Collectors.toList());
    }

    public void deleteComentario(Long id) {
        comentarioRepo.deleteById(id);
    }

    public Optional<PublicacionDTO> getPublicacionById(Long id) {
        return publicacionRepo.findById(id).map(p ->
            new PublicacionDTO(
                p.getId(),
                p.getTitulo(),
                p.getContenido(),
                p.getFechaCreacion(),
                p.getCategoria().getId(),
                p.getUsuario().getId(),
                p.getUsuario().getUsername()
            )
        );
    }
}
