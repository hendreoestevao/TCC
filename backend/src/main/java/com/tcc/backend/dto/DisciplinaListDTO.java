package com.tcc.backend.dto;

import java.util.List;

public class DisciplinaListDTO {
    private Long id;
    private String nome;
    private Integer cargaHoraria;
    private Double notaMaxima;
    private String curso;
    private List<String> turmas;

    // Construtor
    public DisciplinaListDTO(Long id, String nome, Integer cargaHoraria, Double notaMaxima, String curso, List<String> turmas) {
        this.id = id;
        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
        this.notaMaxima = notaMaxima;
        this.curso = curso;
        this.turmas = turmas;
    }

    // Getters e Setters
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

    public Integer getCargaHoraria() {
        return cargaHoraria;
    }

    public void setCargaHoraria(Integer cargaHoraria) {
        this.cargaHoraria = cargaHoraria;
    }

    public Double getNotaMaxima() {
        return notaMaxima;
    }

    public void setNotaMaxima(Double notaMaxima) {
        this.notaMaxima = notaMaxima;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public List<String> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<String> turmas) {
        this.turmas = turmas;
    }
}
