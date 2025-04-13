package com.fsalgado.foro.DTO;

import java.time.LocalDateTime;

public class ComentarioDTO {
    private Long id;
    private String contenido;
    private LocalDateTime fecha;
    private Long publicacionId;
    private Long usuarioId;

    public ComentarioDTO() {}

    public ComentarioDTO(Long id, String contenido, LocalDateTime fecha,
                         Long publicacionId, Long usuarioId) {
        this.id = id;
        this.contenido = contenido;
        this.fecha = fecha;
        this.publicacionId = publicacionId;
        this.usuarioId = usuarioId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Long getPublicacionId() {
        return publicacionId;
    }

    public void setPublicacionId(Long publicacionId) {
        this.publicacionId = publicacionId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    
}

