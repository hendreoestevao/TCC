package com.tcc.backend.dto;

import java.util.List;

public class AlunoDTO {
    private Long id;
    private String ra;
    private String nome;
    private String sobrenome;
    private String email;
    private String senha;
    private String cursoNome;
    private Long cursoId; // Pode ser null se o curso não estiver definido
    private List<Long> turmas;
    private String roleNome;

    // Construtor
    public AlunoDTO(Long id, String ra, String nome, String sobrenome, String email, String senha,
                    String cursoNome, Long cursoId, List<Long> turmas, String roleNome) {
        this.id = id;
        this.ra = ra;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.email = email;
        this.senha = senha;
        this.cursoNome = cursoNome;
        this.cursoId = cursoId; // Inicializado como null se não fornecido
        this.turmas = turmas;
        this.roleNome = roleNome;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRa() {
        return ra;
    }

    public void setRa(String ra) {
        this.ra = ra;
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

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCursoNome() {
        return cursoNome;
    }

    public void setCursoNome(String cursoNome) {
        this.cursoNome = cursoNome;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public List<Long> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<Long> turmas) {
        this.turmas = turmas;
    }

    public String getRoleNome() {
        return roleNome;
    }

    public void setRoleNome(String roleNome) {
        this.roleNome = roleNome;
    }
}
