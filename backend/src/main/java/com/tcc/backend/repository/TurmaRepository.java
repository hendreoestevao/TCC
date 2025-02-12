package com.tcc.backend.repository;

import com.tcc.backend.entity.Turma;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {
    List<Turma> findByPeriodoContainingIgnoreCase(String periodo);

    @Query(value = """
        SELECT 
            t.id AS turma_id,
            t.periodo AS turma_periodo,
            c.nome AS curso_nome,
            
            -- Alunos: Apenas o nome completo
            ARRAY_AGG(DISTINCT a.nome || ' ' || a.sobrenome) AS alunos,
            
            -- Professores: Apenas o nome completo
            ARRAY_AGG(DISTINCT p.nome || ' ' || p.sobrenome) AS professores,
            
            -- Disciplinas: Apenas o nome
            ARRAY_AGG(DISTINCT d.nome) AS disciplinas

        FROM turmas t
        LEFT JOIN cursos c ON t.curso_id = c.id
        LEFT JOIN aluno_turma at ON t.id = at.turma_id
        LEFT JOIN alunos a ON at.aluno_id = a.id
        LEFT JOIN professor_turma pt ON t.id = pt.turma_id
        LEFT JOIN professores p ON pt.professor_id = p.id
        LEFT JOIN disciplina_turma dt ON t.id = dt.turma_id
        LEFT JOIN disciplinas d ON dt.disciplina_id = d.id

        GROUP BY t.id, t.periodo, c.nome
        ORDER BY t.id
        """, nativeQuery = true)
    List<Object[]> findAllWithRelations();

}
