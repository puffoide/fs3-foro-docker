package com.fsalgado.foro.DTO;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ComentarioDTO {
    private Long id;
    private String contenido;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime fecha;
    private Long publicacionId;
    private Long usuarioId;
    private String username;
    private String rol;

    public ComentarioDTO() {}

    public ComentarioDTO(Long id, String contenido, LocalDateTime fecha,
                     Long publicacionId, Long usuarioId) {
        this.id = id;
        this.contenido = contenido;
        this.fecha = fecha;
        this.publicacionId = publicacionId;
        this.usuarioId = usuarioId;
    }


    public ComentarioDTO(Long id, String contenido, LocalDateTime fecha,
                         Long publicacionId, Long usuarioId,
                         String username, String rol) {
        this.id = id;
        this.contenido = contenido;
        this.fecha = fecha;
        this.publicacionId = publicacionId;
        this.usuarioId = usuarioId;
        this.username = username;
        this.rol = rol;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
