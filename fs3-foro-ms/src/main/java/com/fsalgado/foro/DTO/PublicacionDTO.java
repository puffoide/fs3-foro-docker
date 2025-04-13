package com.fsalgado.foro.DTO;

import java.time.LocalDateTime;

public class PublicacionDTO {
    private Long id;
    private String titulo;
    private String contenido;
    private LocalDateTime fechaCreacion;
    private Long categoriaId;
    private Long usuarioId;

    public PublicacionDTO() {}

    public PublicacionDTO(Long id, String titulo, String contenido, LocalDateTime fechaCreacion,
                          Long categoriaId, Long usuarioId) {
        this.id = id;
        this.titulo = titulo;
        this.contenido = contenido;
        this.fechaCreacion = fechaCreacion;
        this.categoriaId = categoriaId;
        this.usuarioId = usuarioId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }


    
}

