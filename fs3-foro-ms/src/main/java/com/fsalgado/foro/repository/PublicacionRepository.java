package com.fsalgado.foro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fsalgado.foro.model.Publicacion;

public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {}
