package com.tcc.backend.service;

import com.tcc.backend.dto.DisciplinaDTO;
import com.tcc.backend.dto.DisciplinaListDTO;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.entity.Professor;
import com.tcc.backend.entity.Turma;
import com.tcc.backend.repository.DisciplinaRepository;
import com.tcc.backend.repository.CursoRepository;
import com.tcc.backend.repository.ProfessorRepository;
import com.tcc.backend.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private TurmaRepository turmaRepository;


    public Disciplina createDisciplina(Disciplina disciplina) {
        return disciplinaRepository.save(disciplina);
    }

    public List<Disciplina> getAllDisciplinas() {
        return disciplinaRepository.findAll();
    }

    public Disciplina getDisciplinaById(Long id) {
        return disciplinaRepository.findById(id).orElse(null);
    }

    public List<DisciplinaListDTO> getAllDisciplinasAsDTO() {
        List<Disciplina> disciplinas = disciplinaRepository.findAll();
        return disciplinas.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Disciplina updateDisciplina(Long id, DisciplinaDTO disciplinaDTO) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));

        disciplina.setNome(disciplinaDTO.getNome());
        disciplina.setCargaHoraria(disciplinaDTO.getCargaHoraria());
        disciplina.setNotaMaxima(disciplinaDTO.getNotaMaxima());

        if (disciplinaDTO.getCursoId() != null) {
            Curso curso = cursoRepository.findById(disciplinaDTO.getCursoId())
                    .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
            disciplina.setCurso(curso);
        }

        if (disciplinaDTO.getTurmaIds() != null && !disciplinaDTO.getTurmaIds().isEmpty()) {
            Set<Turma> turmas = disciplinaDTO.getTurmaIds().stream()
                    .map(turmaId -> turmaRepository.findById(turmaId)
                            .orElseThrow(() -> new RuntimeException("Turma não encontrada: " + turmaId)))
                    .collect(Collectors.toSet());
            disciplina.setTurmas(turmas);
        }

        return disciplinaRepository.save(disciplina);
    }

    public DisciplinaDTO toDisciplinaDTO(Disciplina disciplina) {
        return new DisciplinaDTO(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.getCargaHoraria(),
                disciplina.getNotaMaxima(),
                disciplina.getCurso() != null ? disciplina.getCurso().getId() : null,
                disciplina.getTurmas() != null
                        ? disciplina.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                        : Collections.emptyList()
        );
    }


    public Disciplina findById(Long id) {
        Optional<Disciplina> disciplinaOpt = disciplinaRepository.findById(id);
        return disciplinaOpt.orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
    }

    public void deleteDisciplina(Long id) {
        disciplinaRepository.deleteById(id);
    }

    private DisciplinaListDTO convertToDTO(Disciplina disciplina) {
        String cursoNome = disciplina.getCurso() != null ? disciplina.getCurso().getNome() : "Sem curso";
        List<String> turmas = disciplina.getTurmas()
                .stream()
                .map(Turma::getPeriodo)
                .collect(Collectors.toList());
        return new DisciplinaListDTO(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.getCargaHoraria(),
                disciplina.getNotaMaxima(),
                cursoNome,
                turmas
        );
    }
}

