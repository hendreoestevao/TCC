package com.tcc.backend.dto;

import java.util.List;
import java.util.Set;

public class TurmaListDTO {

    private Long id;
    private String periodo;
    private String cursoNome;
    private List<String> alunos;
    private List<String> professores;
    private List<String> disciplinas;

    public TurmaListDTO(Long id, String periodo, String cursoNome, List<String> alunos, List<String> professores, List<String> disciplinas) {
        this.id = id;
        this.periodo = periodo;
        this.cursoNome = cursoNome;
        this.alunos = alunos;
        this.professores = professores;
        this.disciplinas = disciplinas;
    }

    public List<String> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<String> alunos) {
        this.alunos = alunos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPeriodo() {
        return periodo;
    }

    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }

    public String getCursoNome() {
        return cursoNome;
    }

    public void setCursoNome(String cursoNome) {
        this.cursoNome = cursoNome;
    }

    public List<String> getProfessores() {
        return professores;
    }

    public void setProfessores(List<String> professores) {
        this.professores = professores;
    }

    public List<String> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<String> disciplinas) {
        this.disciplinas = disciplinas;
    }
}