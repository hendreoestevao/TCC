package com.tcc.backend.repository;

import com.tcc.backend.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    List<Professor> findByCursos_Id(Long cursoId);
    List<Professor> findByTurmas_Id(Long turmaId);
    Optional<Professor> findByUsername(String username);
    Optional<Professor> findByUsernameAndPassword(String username, String password);

}
