package com.fsalgado.foro.repository;

import com.fsalgado.foro.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {}
