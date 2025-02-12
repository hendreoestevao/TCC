package com.tcc.backend.dto;


import java.util.List;

public class CursoListDTO {

    private Long id;
    private String nome;
    private List<String> turmas;
    private List<String> disciplinas;
    private List<String> professores;
    private List<String> alunos;

    public CursoListDTO() {
    }

    public CursoListDTO(Long id, String nome, List<String> turmas, List<String> disciplinas, List<String> professores, List<String> alunos) {
        this.id = id;
        this.nome = nome;
        this.turmas = turmas;
        this.disciplinas = disciplinas;
        this.professores = professores;
        this.alunos = alunos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<String> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<String> turmas) {
        this.turmas = turmas;
    }

    public List<String> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<String> disciplinas) {
        this.disciplinas = disciplinas;
    }

    public List<String> getProfessores() {
        return professores;
    }

    public void setProfessores(List<String> professores) {
        this.professores = professores;
    }

    public List<String> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<String> alunos) {
        this.alunos = alunos;
    }
}
