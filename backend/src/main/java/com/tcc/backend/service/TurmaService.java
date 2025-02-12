package com.tcc.backend.service;

import com.tcc.backend.entity.*;
import com.tcc.backend.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tcc.backend.dto.CursoDTO;
import com.tcc.backend.dto.ProfessorDTO;
import com.tcc.backend.dto.DisciplinaDTO;
import com.tcc.backend.dto.AlunoDTO;
import com.tcc.backend.dto.TurmaListDTO;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TurmaService {

    @Autowired
    private TurmaRepository turmaRepository;

    public Turma createTurma(Turma turma) {
        return turmaRepository.save(turma);
    }


    public Optional<Turma> getTurmaById(Long id) {
        return turmaRepository.findById(id);
    }

    public Turma updateTurma(Turma turma) {
        if (turmaRepository.existsById(turma.getId())) {
            return turmaRepository.save(turma);
        }
        return null;
    }

    public void deleteTurma(Long id) {
        turmaRepository.deleteById(id);
    }

    public List<Turma> getTurmasByNome(String nome) {
        return turmaRepository.findByPeriodoContainingIgnoreCase(nome);
    }


    public List<TurmaListDTO> getAllTurmas() {
        List<Object[]> results = turmaRepository.findAllWithRelations();
        return results.stream().map(this::toTurmaListDTO).collect(Collectors.toList());
    }

    private TurmaListDTO toTurmaListDTO(Object[] row) {
        return new TurmaListDTO(
                (Long) row[0],
                (String) row[1],
                (String) row[2],
                parseArray((String[]) row[3]),
                parseArray((String[]) row[4]),
                parseArray((String[]) row[5])
        );
    }

    private List<String> parseArray(String[] array) {
        return array == null ? Collections.emptyList() : Arrays.asList(array);
    }

}