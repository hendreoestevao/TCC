package com.tcc.backend.controller;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.entity.Turma;
import com.tcc.backend.entity.Curso;

import com.tcc.backend.dto.*;
import com.tcc.backend.entity.Professor;
import com.tcc.backend.security.JwtUtil;
import com.tcc.backend.service.AuthServiceProfessor;
import com.tcc.backend.service.ProfessorService;
import com.tcc.backend.service.CursoService;
import com.tcc.backend.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/professores")
public class ProfessorController {

    @Autowired
    private ProfessorService professorService;

    @Autowired
    private AuthServiceProfessor authServiceProfessor;

    @Autowired
    private CursoService cursoService;

    @Autowired
    private TurmaService turmaService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<ProfessorListDTO>> getAllProfessores() {
        List<Professor> professores = professorService.findAllProfessores();

        List<ProfessorListDTO> professorListDTOs = professores.stream()
                .map(professor -> new ProfessorListDTO(
                        professor.getId(),
                        professor.getUsername(),
                        professor.getPassword(),
                        professor.getNome(),
                        professor.getSobrenome(),
                        professor.getEmail(),
                        professor.getDisciplinas().stream()
                                .map(disciplina -> new DisciplinaDTO(
                                        disciplina.getId(),
                                        disciplina.getNome(),
                                        disciplina.getCargaHoraria(),
                                        disciplina.getNotaMaxima(),
                                        disciplina.getCurso() != null ? disciplina.getCurso().getId() : null,
                                        disciplina.getTurmas() != null
                                                ? disciplina.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                                                : List.of()
                                ))
                                .collect(Collectors.toSet()),
                        professor.getTurmas().stream()
                                .map(turma -> new TurmaDTO(turma.getId(), turma.getPeriodo()))
                                .collect(Collectors.toSet()),
                        professor.getCursos().stream()
                                .map(curso -> new CursoDTO(curso.getId(), curso.getNome()))
                                .collect(Collectors.toSet())
                ))
                .collect(Collectors.toList());

        return new ResponseEntity<>(professorListDTOs, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<Professor> createProfessor(@RequestBody Professor professor) {
        try {
            Professor savedProfessor = professorService.saveProfessor(professor);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProfessor);
        } catch (Exception e) {
            System.err.println("Erro ao criar professor: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<Professor> updateProfessor(
            @PathVariable Long id,
            @RequestBody ProfessorDTO professorDTO) {

        Professor updatedProfessor = professorService.updateProfessor(id, professorDTO);

        if (updatedProfessor != null) {
            return ResponseEntity.ok(updatedProfessor);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfessor(@PathVariable Long id) {
        professorService.deleteProfessor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<ProfessorListDTO>> getProfessoresByCurso(@PathVariable Long cursoId) {
        List<Professor> professores = professorService.getProfessoresByCurso(cursoId);

        List<ProfessorListDTO> professorListDTOS = professores.stream()
                .map(professor -> {
                    Set<DisciplinaDTO> disciplinaDTOs = professor.getDisciplinas().stream()
                            .map(disciplina -> new DisciplinaDTO(
                                    disciplina.getId(),
                                    disciplina.getNome(),
                                    disciplina.getCargaHoraria(),
                                    disciplina.getNotaMaxima(),
                                    disciplina.getCurso() != null ? disciplina.getCurso().getId() : null,
                                    disciplina.getTurmas() != null
                                            ? disciplina.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                                            : List.of()
                            ))
                            .collect(Collectors.toSet());

                    Set<TurmaDTO> turmaDTOs = professor.getTurmas().stream()
                            .map(turma -> new TurmaDTO(
                                    turma.getId(),
                                    turma.getPeriodo()
                            ))
                            .collect(Collectors.toSet());

                    Set<CursoDTO> cursoDTOs = professor.getCursos().stream()
                            .map(curso -> new CursoDTO(
                                    curso.getId(),
                                    curso.getNome()
                            ))
                            .collect(Collectors.toSet());

                    return new ProfessorListDTO(
                            professor.getId(),
                            professor.getUsername(),
                            professor.getPassword(),
                            professor.getNome(),
                            professor.getSobrenome(),
                            professor.getEmail(),
                            disciplinaDTOs,
                            turmaDTOs,
                            cursoDTOs
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(professorListDTOS);
    }


    @GetMapping("/turma/{turmaId}")
    public ResponseEntity<List<Professor>> getProfessoresByTurma(@PathVariable Long turmaId) {
        List<Professor> professores = professorService.getProfessoresByTurma(turmaId);
        return ResponseEntity.ok(professores);
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponseProfessor> login(@RequestBody LoginRequestProfessor loginRequestProfessor) {
        try {
            String token = authServiceProfessor.authenticate(loginRequestProfessor.getUsername(), loginRequestProfessor.getPassword());

            Professor professor = professorService.findProfessorByUsername(loginRequestProfessor.getUsername())
                    .orElseThrow(() -> new RuntimeException("Professor not found"));

            LoginResponseProfessor response = new LoginResponseProfessor(token, professor.getNome(), professor.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/p/{id}")
    public ResponseEntity<ProfessorDTO> getProfessorById(@PathVariable Long id) {
        Optional<Professor> optionalProfessor = professorService.findProfessorById(id);

        if (optionalProfessor.isPresent()) {
            Professor professor = optionalProfessor.get();

            List<Long> disciplinaIds = professor.getDisciplinas() != null
                    ? professor.getDisciplinas().stream().map(Disciplina::getId).collect(Collectors.toList())
                    : List.of();

            List<String> disciplinaNomes = professor.getDisciplinas() != null
                    ? professor.getDisciplinas().stream().map(Disciplina::getNome).collect(Collectors.toList())
                    : List.of();

            List<Long> turmaIds = professor.getTurmas() != null
                    ? professor.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                    : List.of();

            List<String> turmaNomes = professor.getTurmas() != null
                    ? professor.getTurmas().stream().map(Turma::getPeriodo).collect(Collectors.toList())
                    : List.of();

            List<Long> cursoIds = professor.getCursos() != null
                    ? professor.getCursos().stream().map(Curso::getId).collect(Collectors.toList())
                    : List.of();

            List<String> cursoNomes = professor.getCursos() != null
                    ? professor.getCursos().stream().map(Curso::getNome).collect(Collectors.toList())
                    : List.of();

            ProfessorDTO professorDTO = new ProfessorDTO(
                    professor.getId(),
                    professor.getUsername(),
                    professor.getPassword(),
                    professor.getNome(),
                    professor.getSobrenome(),
                    professor.getEmail(),
                    disciplinaIds,
                    disciplinaNomes,
                    turmaIds,
                    turmaNomes,
                    cursoIds,
                    cursoNomes
            );

            return ResponseEntity.ok(professorDTO);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}