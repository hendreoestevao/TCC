package com.tcc.backend.service;

import com.tcc.backend.dto.CursoListDTO;
import com.tcc.backend.entity.Curso;
import com.tcc.backend.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    public Curso createCurso(Curso curso) {
        return cursoRepository.save(curso);
    }

    public List<Curso> getAllCursos() {
        return cursoRepository.findAll();
    }

    public Curso getCursoById(Long id) {
        return cursoRepository.findById(id).orElse(null);
    }

    public Curso updateCurso(Long id, Curso curso) {
        curso.setId(id);
        return cursoRepository.save(curso);
    }

    public void deleteCurso(Long id) {
        cursoRepository.deleteById(id);
    }

    public List<Curso> getCursosByNome(String nome) {
        return (List<Curso>) cursoRepository.findFirstByNomeContainingIgnoreCase(nome);
    }
    public Optional<Curso> findCursoById(Long id) {
        return cursoRepository.findById(id);
    }

    public List<CursoListDTO> listarCursos() {
        List<Curso> cursos = cursoRepository.findAll();

        return cursos.stream().map(curso -> new CursoListDTO(
                curso.getId(),
                curso.getNome(),
                curso.getTurmas().stream().map(turma -> turma.getPeriodo()).collect(Collectors.toList()),
                curso.getDisciplinas().stream().map(disciplina -> disciplina.getNome()).collect(Collectors.toList()),
                curso.getProfessores().stream().map(professor -> professor.getNome()).collect(Collectors.toList()),
                curso.getAlunos().stream().map(aluno -> aluno.getNome()).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }
}
