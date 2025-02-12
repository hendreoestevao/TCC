package com.tcc.backend.service;

import com.tcc.backend.dto.DashboardSummaryDTO;
import com.tcc.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final TurmaRepository turmaRepository;
    private final ProfessorRepository professorRepository;

    @Autowired
    public DashboardService(AlunoRepository alunoRepository,
                            CursoRepository cursoRepository,
                            DisciplinaRepository disciplinaRepository,
                            TurmaRepository turmaRepository,
                            ProfessorRepository professorRepository) {
        this.alunoRepository = alunoRepository;
        this.cursoRepository = cursoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.turmaRepository = turmaRepository;
        this.professorRepository = professorRepository;
    }

    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalAlunos(alunoRepository.count());
        summary.setTotalCursos(cursoRepository.count());
        summary.setTotalDisciplinas(disciplinaRepository.count());
        summary.setTotalTurmas(turmaRepository.count());
        summary.setTotalProfessores(professorRepository.count());
        return summary;
    }
}