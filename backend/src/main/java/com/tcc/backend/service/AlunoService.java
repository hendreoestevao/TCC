package com.tcc.backend.service;

import com.tcc.backend.dto.AlunoDTO;
import com.tcc.backend.dto.AlunoNotaFaltaDTO;
import com.tcc.backend.dto.DisciplinaDTO;
import com.tcc.backend.entity.*;
import com.tcc.backend.repository.AlunoRepository;
import com.tcc.backend.repository.CursoRepository;
import com.tcc.backend.repository.RoleRepository;
import com.tcc.backend.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    @Autowired
    private RoleRepository roleRepository;

    public Aluno save(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public Aluno createAluno(Aluno aluno) {

        Role alunoRole = roleRepository.findByName("ALUNO");
        if (alunoRole == null) {
            alunoRole = new Role();
            alunoRole.setName("ALUNO");

            alunoRole = roleRepository.save(alunoRole);
        }
        aluno.setRole(alunoRole);

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(aluno.getSenha());
        aluno.setSenha(hashedPassword);

        return alunoRepository.save(aluno);
    }


    public Aluno updateAluno(String ra, Aluno alunoUpdates) {
        Aluno existingAluno = alunoRepository.findByRa(ra);

        if (existingAluno != null) {
            existingAluno.setNome(alunoUpdates.getNome());
            existingAluno.setSobrenome(alunoUpdates.getSobrenome());
            existingAluno.setEmail(alunoUpdates.getEmail());

            if (alunoUpdates.getCurso() != null && alunoUpdates.getCurso().getId() != null) {
                Curso curso = cursoRepository.findById(alunoUpdates.getCurso().getId())
                        .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado com ID: " + alunoUpdates.getCurso().getId()));
                existingAluno.setCurso(curso);
            }

            if (alunoUpdates.getTurmas() != null && !alunoUpdates.getTurmas().isEmpty()) {
                Set<Turma> turmas = new HashSet<>();
                for (Turma turma : alunoUpdates.getTurmas()) {
                    Turma existingTurma = turmaRepository.findById(turma.getId())
                            .orElseThrow(() -> new EntityNotFoundException("Turma não encontrada com ID: " + turma.getId()));
                    turmas.add(existingTurma);
                }
                existingAluno.setTurmas(turmas);
            }

            if (alunoUpdates.getSenha() != null) {
                String hashedPassword = new BCryptPasswordEncoder().encode(alunoUpdates.getSenha());
                existingAluno.setSenha(hashedPassword);
            }

            return alunoRepository.save(existingAluno);
        } else {
            throw new EntityNotFoundException("Aluno não encontrado com RA: " + ra);
        }
    }

    public List<Aluno> getAllAlunos() {
        return alunoRepository.findAll();
    }

    public List<AlunoNotaFaltaDTO> getNotasEFaltasPorAluno(String ra) {
        Aluno aluno = alunoRepository.findByRa(ra);
        if (aluno == null) {
            throw new EntityNotFoundException("Aluno não encontrado com RA: " + ra);
        }

        List<AlunoNotaFaltaDTO> alunoNotaFaltaList = new ArrayList<>();

        for (RegistroNotaFalta registro : aluno.getRegistrosNotaFalta()) {
            Disciplina disciplina = registro.getDisciplina();
            DisciplinaDTO disciplinaDTO = new DisciplinaDTO(
                    disciplina.getId(),
                    disciplina.getNome(),
                    disciplina.getCargaHoraria(),
                    disciplina.getNotaMaxima(),
                    disciplina.getCurso() != null ? disciplina.getCurso().getId() : null,
                    disciplina.getTurmas() != null
                            ? disciplina.getTurmas().stream().map(Turma::getId).collect(Collectors.toList())
                            : null
            );

            AlunoNotaFaltaDTO dto = new AlunoNotaFaltaDTO(disciplinaDTO, registro.getNota(), registro.getFaltas());
            alunoNotaFaltaList.add(dto);
        }

        return alunoNotaFaltaList;
    }


    public Aluno findById(Long id) {
        Optional<Aluno> alunoOpt = alunoRepository.findById(id);
        return alunoOpt.orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado com ID: " + id));
    }

    public Aluno getAlunoByRa(String ra) {
        Aluno aluno = alunoRepository.findByRa(ra);
        if (aluno == null) {
            throw new EntityNotFoundException("Aluno não encontrado com RA: " + ra);
        }
        return aluno;
    }

    public List<AlunoDTO> getAlunosByTurma(Long turmaId) {
        List<Aluno> alunos = alunoRepository.findByTurmas_Id(turmaId);

        return alunos.stream()
                .map(aluno -> new AlunoDTO(
                        aluno.getId(),
                        aluno.getRa(),
                        aluno.getNome(),
                        aluno.getSobrenome(),
                        aluno.getEmail(),
                        null, // Senha pode ser omitida ou passada como null
                        aluno.getCurso() != null ? aluno.getCurso().getNome() : null,
                        null, // cursoId não é necessário aqui
                        aluno.getTurmas().stream().map(turma -> turma.getId()).collect(Collectors.toList()),
                        aluno.getRole() != null ? aluno.getRole().getName() : null
                ))
                .collect(Collectors.toList());
    }

}

