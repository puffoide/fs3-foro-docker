package com.fsalgado.foro.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "comentarios")
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String contenido;
    private LocalDateTime fechaComentario;
    @ManyToOne
    @JoinColumn(name = "publicacion_id")
    private Publicacion publicacion;
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private User usuario;
    
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
    public LocalDateTime getFechaComentario() {
        return fechaComentario;
    }
    public void setFechaComentario(LocalDateTime fechaComentario) {
        this.fechaComentario = fechaComentario;
    }
    public Publicacion getPublicacion() {
        return publicacion;
    }
    public void setPublicacion(Publicacion publicacion) {
        this.publicacion = publicacion;
    }
    public User getUsuario() {
        return usuario;
    }
    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    
}

