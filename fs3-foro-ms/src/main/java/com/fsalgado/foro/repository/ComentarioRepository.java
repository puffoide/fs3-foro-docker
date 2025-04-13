package com.fsalgado.foro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsalgado.foro.model.Comentario;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {}
