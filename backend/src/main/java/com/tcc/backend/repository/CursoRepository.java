package com.tcc.backend.repository;

import com.tcc.backend.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    Curso findFirstByNomeContainingIgnoreCase(String nome);
}
