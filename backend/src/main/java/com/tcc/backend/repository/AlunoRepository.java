package com.tcc.backend.repository;

import com.tcc.backend.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Aluno findByRa(String ra);
    List<Aluno> findByTurmasId(Long turmaId);
    List<Aluno> findByTurmas_Id(Long turmaId);
}
