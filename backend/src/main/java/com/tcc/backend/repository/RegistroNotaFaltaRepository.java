package com.tcc.backend.repository;

import com.tcc.backend.entity.RegistroNotaFalta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface RegistroNotaFaltaRepository extends JpaRepository<RegistroNotaFalta, Long> {
    List<RegistroNotaFalta> findByDisciplinaIdAndAlunoId(Long disciplinaId, Long alunoId);
    List<RegistroNotaFalta> findByAlunoId(Long alunoId);
    List<RegistroNotaFalta> findByDisciplinaId(Long disciplinaId);
}
