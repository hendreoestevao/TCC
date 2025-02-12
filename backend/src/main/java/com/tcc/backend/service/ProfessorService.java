package com.tcc.backend.service;

import com.tcc.backend.dto.ProfessorDTO;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.entity.Professor;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.entity.Turma;
import com.tcc.backend.repository.CursoRepository;
import com.tcc.backend.repository.DisciplinaRepository;
import com.tcc.backend.repository.ProfessorRepository;
import com.tcc.backend.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    public Professor saveProfessor(Professor professor) {
        return professorRepository.save(professor);
    }

    public List<Professor> findAllProfessores() {
        return professorRepository.findAll();
    }

    public Optional<Professor> findProfessorById(Long id) {
        return professorRepository.findById(id);
    }

    public void deleteProfessor(Long id) {
        professorRepository.deleteById(id);
    }

    public List<Professor> findProfessoresByCurso(Long cursoId) {
        return professorRepository.findByCursos_Id(cursoId);
    }

    public List<Professor> findProfessoresByTurma(Long turmaId) {
        return professorRepository.findByTurmas_Id(turmaId);
    }


    @Transactional
    public Professor updateProfessor(Long id, ProfessorDTO professorDTO) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Professor com id " + id + " não encontrado."));

        professor.setUsername(professorDTO.getUsername());
        professor.setPassword(professorDTO.getPassword());
        professor.setNome(professorDTO.getNome());
        professor.setSobrenome(professorDTO.getSobrenome());
        professor.setEmail(professorDTO.getEmail());

        if (professorDTO.getCursos() != null) {
            Set<Curso> cursosAtualizados = professorDTO.getCursos().stream()
                    .map(cursoId -> cursoRepository.findById(cursoId)
                            .orElseThrow(() -> new EntityNotFoundException("Curso com id " + cursoId + " não encontrado.")))
                    .collect(Collectors.toSet());
            professor.setCursos(cursosAtualizados);
        }

        if (professorDTO.getTurmas() != null) {
            Set<Turma> turmasAtualizadas = professorDTO.getTurmas().stream()
                    .map(turmaId -> turmaRepository.findById(turmaId)
                            .orElseThrow(() -> new EntityNotFoundException("Turma com id " + turmaId + " não encontrada.")))
                    .collect(Collectors.toSet());
            professor.setTurmas(turmasAtualizadas);
        }

        if (professorDTO.getDisciplinas() != null) {
            Set<Disciplina> disciplinasAtualizadas = professorDTO.getDisciplinas().stream()
                    .map(disciplinaId -> disciplinaRepository.findById(disciplinaId)
                            .orElseThrow(() -> new EntityNotFoundException("Disciplina com id " + disciplinaId + " não encontrada.")))
                    .collect(Collectors.toSet());
            professor.setDisciplinas(disciplinasAtualizadas);
        }
        return professorRepository.save(professor);
    }



    public List<Professor> getProfessoresByCurso(Long cursoId) {
        return professorRepository.findByCursos_Id(cursoId);
    }

    public List<Professor> getProfessoresByTurma(Long turmaId) {
        return professorRepository.findByTurmas_Id(turmaId);
    }

    public Optional<Professor> findProfessorByUsername(String username) {
        return professorRepository.findByUsername(username);
    }

}
