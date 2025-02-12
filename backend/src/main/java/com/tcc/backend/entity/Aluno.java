package com.tcc.backend.entity;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "alunos")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ra;
    private String nome;
    private String sobrenome;
    private String email;
    private String senha;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToMany
    @JoinTable(name = "aluno_turma",
            joinColumns = @JoinColumn(name = "aluno_id"),
            inverseJoinColumns = @JoinColumn(name = "turma_id"))
    private Set<Turma> turmas;

    @OneToMany(mappedBy = "aluno")
   // @JsonIgnore
    private Set<RegistroNotaFalta> registrosNotaFalta;


    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

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

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }

    public Set<Turma> getTurmas() {
        return turmas;
    }

    public void setTurmas(Set<Turma> turmas) {
        this.turmas = turmas;
    }

    public Set<RegistroNotaFalta> getRegistrosNotaFalta() {
        return registrosNotaFalta;
    }

    public void setRegistrosNotaFalta(Set<RegistroNotaFalta> registrosNotaFalta) {
        this.registrosNotaFalta = registrosNotaFalta;
    }

}
