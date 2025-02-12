package com.tcc.backend.service;

import com.tcc.backend.dto.RegistroDTO;
import com.tcc.backend.dto.UpdateRegistroDTO;
import com.tcc.backend.entity.Aluno;
import com.tcc.backend.entity.Disciplina;
import com.tcc.backend.entity.RegistroNotaFalta;
import com.tcc.backend.repository.AlunoRepository;
import com.tcc.backend.repository.DisciplinaRepository;
import com.tcc.backend.repository.RegistroNotaFaltaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroNotaFaltaService {

    @Autowired
    private RegistroNotaFaltaRepository registroNotaFaltaRepository;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private DisciplinaService disciplinaService;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private RegistroNotaFaltaRepository repo;

    public RegistroNotaFalta createRegistro(RegistroNotaFalta registroNotaFalta) {
        return registroNotaFaltaRepository.save(registroNotaFalta);
    }

    public List<RegistroNotaFalta> getAllRegistros() {
        return registroNotaFaltaRepository.findAll();
    }

    public RegistroNotaFalta addRegistroNotaFalta(Long disciplinaId, RegistroNotaFalta registroNotaFalta) {
        Disciplina disciplina = disciplinaService.findById(disciplinaId);
        registroNotaFalta.setDisciplina(disciplina);

        Aluno aluno = alunoService.getAlunoByRa(registroNotaFalta.getAluno().getRa());
        registroNotaFalta.setAluno(aluno);

        return registroNotaFaltaRepository.save(registroNotaFalta);
    }


    public RegistroNotaFalta updateRegistro(UpdateRegistroDTO updateDTO) {
        Aluno aluno = alunoRepository.findByRa(updateDTO.getRaAluno());
        if (aluno == null) {
            return null;
        }

        Disciplina disciplina = disciplinaRepository.findById(updateDTO.getDisciplinaId()).orElse(null);
        if (disciplina == null) {
            return null;
        }

        List<RegistroNotaFalta> registros = registroNotaFaltaRepository.findByDisciplinaIdAndAlunoId(updateDTO.getDisciplinaId(), aluno.getId());
        if (registros.isEmpty()) {
            return null;
        }

        RegistroNotaFalta registro = registros.get(0);

        registro.setNota(updateDTO.getNota());
        registro.setFaltas(updateDTO.getFaltas());

        return registroNotaFaltaRepository.save(registro);
    }
    public RegistroNotaFalta createRegistro(RegistroDTO registroDTO) {
        Aluno aluno = alunoRepository.findByRa(registroDTO.getRaAluno());
        if (aluno == null) {
            return null;
        }

        Disciplina disciplina = disciplinaRepository.findById(registroDTO.getDisciplinaId()).orElse(null);
        if (disciplina == null) {
            return null;
        }

        RegistroNotaFalta novoRegistro = new RegistroNotaFalta();
        novoRegistro.setAluno(aluno);
        novoRegistro.setDisciplina(disciplina);
        novoRegistro.setNota(registroDTO.getNota());
        novoRegistro.setFaltas(registroDTO.getFaltas());

        return registroNotaFaltaRepository.save(novoRegistro);
    }


}



