package com.tcc.backend.dto;

import java.util.Set;

public class ProfessorListDTO {
    private Long id;
    private String username;
    private String password;
    private String nome;
    private String sobrenome;
    private String email;
    private Set<DisciplinaDTO> disciplinas;
    private Set<TurmaDTO> turmas;
    private Set<CursoDTO> cursos;

    public ProfessorListDTO(Long id, String username, String password, String nome, String sobrenome, String email,
                            Set<DisciplinaDTO> disciplinas, Set<TurmaDTO> turmas, Set<CursoDTO> cursos) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.disciplinas = disciplinas;
        this.turmas = turmas;
        this.cursos = cursos;
    }

    // Getters e setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public Set<DisciplinaDTO> getDisciplinas() {
        return disciplinas;
    }

    public void setDisciplinas(Set<DisciplinaDTO> disciplinas) {
        this.disciplinas = disciplinas;
    }

    public Set<TurmaDTO> getTurmas() {
        return turmas;
    }

    public void setTurmas(Set<TurmaDTO> turmas) {
        this.turmas = turmas;
    }

    public Set<CursoDTO> getCursos() {
        return cursos;
    }

    public void setCursos(Set<CursoDTO> cursos) {
        this.cursos = cursos;
    }
}
