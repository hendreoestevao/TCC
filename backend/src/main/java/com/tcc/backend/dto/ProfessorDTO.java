package com.tcc.backend.dto;

import java.util.List;

public class ProfessorDTO {
    private Long id;
    private String username;
    private String password;
    private String nome;
    private String sobrenome;
    private String email;

    private List<Long> disciplinas;
    private List<String> disciplinaNomes;

    private List<Long> turmas;
    private List<String> turmaNomes;

    private List<Long> cursos;
    private List<String> cursoNomes;

    public ProfessorDTO(Long id, String username, String password, String nome, String sobrenome, String email,
                        List<Long> disciplinas, List<String> disciplinaNomes, List<Long> turmas, List<String> turmaNomes,
                        List<Long> cursos, List<String> cursoNomes) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.disciplinas = disciplinas;
        this.disciplinaNomes = disciplinaNomes;
        this.turmas = turmas;
        this.turmaNomes = turmaNomes;
        this.cursos = cursos;
        this.cursoNomes = cursoNomes;
    }


    public List<String> getDisciplinaNomes() {
        return disciplinaNomes;
    }

    public void setDisciplinaNomes(List<String> disciplinaNomes) {
        this.disciplinaNomes = disciplinaNomes;
    }

    public List<String> getTurmaNomes() {
        return turmaNomes;
    }

    public void setTurmaNomes(List<String> turmaNomes) {
        this.turmaNomes = turmaNomes;
    }

    public List<String> getCursoNomes() {
        return cursoNomes;
    }

    public void setCursoNomes(List<String> cursoNomes) {
        this.cursoNomes = cursoNomes;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Long> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(List<Long> disciplinas) {
        this.disciplinas = disciplinas;
    }

    public List<Long> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Long> turmas) {
        this.turmas = turmas;
    }

    public List<Long> getCursos() {
        return cursos;
    }

    public void setCursos(List<Long> cursos) {
        this.cursos = cursos;
    }
}
