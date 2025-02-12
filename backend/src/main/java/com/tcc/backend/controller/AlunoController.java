package com.tcc.backend.controller;

import com.tcc.backend.dto.AlunoDTO;
import com.tcc.backend.dto.AlunoNotaFaltaDTO;
import com.tcc.backend.dto.TurmaDTO;
import com.tcc.backend.entity.Aluno;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.entity.Turma;
import com.tcc.backend.entity.Role;
import com.tcc.backend.repository.AlunoRepository;
import com.tcc.backend.repository.CursoRepository;
import com.tcc.backend.repository.RoleRepository;
import com.tcc.backend.repository.TurmaRepository;
import com.tcc.backend.security.RoleUtil;
import com.tcc.backend.service.AlunoService;
import com.tcc.backend.service.AuthServiceAluno;
import com.tcc.backend.security.AuthResponse;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alunos")
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private AuthServiceAluno authServiceAluno;

    @Autowired
    private RoleUtil roleUtil;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Autowired
    private AlunoRepository alunoRepository;

    public Aluno save(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Aluno> createAluno(@RequestBody AlunoDTO alunoDTO) {
        try {
            System.out.println("Recebido DTO: " + alunoDTO);

            // Recuperar o Role para o aluno
            Role alunoRole = roleUtil.getOrCreateAlunoRole();

            // Recuperar o Curso a partir do ID
            Curso curso = null;
            if (alunoDTO.getCursoId() != null) {
                curso = cursoRepository.findById(alunoDTO.getCursoId())
                        .orElseThrow(() -> new RuntimeException("Curso não encontrado com ID: " + alunoDTO.getCursoId()));
            }

            // Recuperar as Turmas a partir dos IDs e converter para Set
            List<Turma> turmasList = turmaRepository.findAllById(alunoDTO.getTurmas());
            Set<Turma> turmasSet = new HashSet<>(turmasList); // Converte List para Set

            // Criar a entidade Aluno
            Aluno aluno = new Aluno();
            aluno.setRa(alunoDTO.getRa());
            aluno.setNome(alunoDTO.getNome());
            aluno.setSobrenome(alunoDTO.getSobrenome());
            aluno.setEmail(alunoDTO.getEmail());
            aluno.setSenha(alunoDTO.getSenha());
            aluno.setCurso(curso);
            aluno.setTurmas(turmasSet); // Define as turmas como Set
            aluno.setRole(alunoRole);

            // Persistir o Aluno
            Aluno createdAluno = alunoService.createAluno(aluno);

            return ResponseEntity.ok(createdAluno);

        } catch (Exception e) {
            System.err.println("Erro ao criar aluno: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }




    @PutMapping("/{ra}")
    public ResponseEntity<Map<String, Object>> updateAluno(@PathVariable String ra, @RequestBody AlunoDTO alunoDTO) {
        Aluno existingAluno = alunoService.getAlunoByRa(ra);
        if (existingAluno == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Aluno não encontrado com RA: " + ra));
        }

        existingAluno.setNome(alunoDTO.getNome());
        existingAluno.setSobrenome(alunoDTO.getSobrenome());
        existingAluno.setEmail(alunoDTO.getEmail());
        existingAluno.setRa(alunoDTO.getRa());

        if (alunoDTO.getSenha() != null && !alunoDTO.getSenha().isEmpty()) {
            String hashedPassword = new BCryptPasswordEncoder().encode(alunoDTO.getSenha());
            existingAluno.setSenha(hashedPassword);
        }

        if (alunoDTO.getCursoNome() != null) {
            Curso curso = cursoRepository.findFirstByNomeContainingIgnoreCase(alunoDTO.getCursoNome());
            if (curso != null) {
                existingAluno.setCurso(curso);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Curso não encontrado: " + alunoDTO.getCursoNome()));
            }
        }

        if (alunoDTO.getTurmas() != null && !alunoDTO.getTurmas().isEmpty()) {
            Set<Turma> turmas = new HashSet<>();
            for (Long turmaId : alunoDTO.getTurmas()) {
                Optional<Turma> turmaOptional = turmaRepository.findById(turmaId);
                if (turmaOptional.isPresent()) {
                    turmas.add(turmaOptional.get());
                } else {
                    return ResponseEntity.badRequest().body(Map.of("error", "Turma não encontrada com ID: " + turmaId));
                }
            }
            existingAluno.setTurmas(turmas);
        }

        if (alunoDTO.getRoleNome() != null) {
            Role role = roleRepository.findByName(alunoDTO.getRoleNome());
            if (role != null) {
                existingAluno.setRole(role);
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Role não encontrado: " + alunoDTO.getRoleNome()));
            }
        }

        Aluno updatedAluno = alunoService.save(existingAluno);

        AlunoDTO updatedAlunoDTO = new AlunoDTO(
                updatedAluno.getId(),
                updatedAluno.getRa(),
                updatedAluno.getNome(),
                updatedAluno.getSobrenome(),
                updatedAluno.getEmail(),
                updatedAluno.getSenha(),
                updatedAluno.getCurso() != null ? updatedAluno.getCurso().getNome() : "Curso não definido",
                null, // cursoId não é necessário aqui
                updatedAluno.getTurmas() != null
                        ? updatedAluno.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                        : new ArrayList<>(),
                updatedAluno.getRole() != null ? updatedAluno.getRole().getName() : "Role não definido"
        );


        Map<String, Object> response = new HashMap<>();
        response.put("aluno", updatedAlunoDTO);
        response.put("turmas", updatedAluno.getTurmas().stream()
                .map(turma -> Map.of("id", turma.getId(), "nome", turma.getPeriodo()))
                .collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }



    @GetMapping
    public ResponseEntity<List<AlunoDTO>> getAllAlunos() {
        List<Aluno> alunos = alunoService.getAllAlunos();

        List<AlunoDTO> alunosDTO = alunos.stream().map(aluno -> {
            return new AlunoDTO(
                    aluno.getId(),
                    aluno.getRa(),
                    aluno.getNome(),
                    aluno.getSobrenome(),
                    aluno.getEmail(),
                    aluno.getSenha(),
                    aluno.getCurso() != null ? aluno.getCurso().getNome() : "Curso não definido",
                    null, // cursoId não é necessário aqui
                    aluno.getTurmas() != null
                            ? aluno.getTurmas().stream()
                            .map(Turma::getId)
                            .collect(Collectors.toList())
                            : new ArrayList<>(),
                    aluno.getRole() != null ? aluno.getRole().getName() : "Role não definido"
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(alunosDTO);
    }


    @GetMapping("/turma/{turmaId}")
    public List<AlunoDTO> getAlunosByTurma(@PathVariable Long turmaId) {
        return alunoService.getAlunosByTurma(turmaId);
    }

    @GetMapping("/{ra}")
    public ResponseEntity<Map<String, Object>> getAlunoByRa(@PathVariable String ra) {
        Aluno aluno = alunoService.getAlunoByRa(ra);
        if (aluno == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Aluno não encontrado com RA: " + ra));
        }

        AlunoDTO alunoDTO = new AlunoDTO(
                aluno.getId(),
                aluno.getRa(),
                aluno.getNome(),
                aluno.getSobrenome(),
                aluno.getEmail(),
                aluno.getSenha(),
                aluno.getCurso() != null ? aluno.getCurso().getNome() : "Curso não definido",
                aluno.getCurso() != null ? aluno.getCurso().getId() : null, // Preencher o cursoId
                aluno.getTurmas() != null
                        ? aluno.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                        : new ArrayList<>(),
                aluno.getRole() != null ? aluno.getRole().getName() : "Role não definido"
        );

        List<AlunoNotaFaltaDTO> notasEFaltas = alunoService.getNotasEFaltasPorAluno(ra);

        Map<String, Object> response = new HashMap<>();
        response.put("aluno", alunoDTO);
        response.put("notasEFaltas", notasEFaltas);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody Map<String, String> loginData) {
        String ra = loginData.get("ra");
        String senha = loginData.get("senha");

        AuthResponse authResponse = authServiceAluno.authenticate(ra, senha);

        return ResponseEntity.ok(authResponse);
    }
}
