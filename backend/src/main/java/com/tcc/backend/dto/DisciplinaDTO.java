package com.tcc.backend.dto;

import java.util.List;

public class DisciplinaDTO {
    private Long id;
    private String nome;
    private Integer cargaHoraria;
    private Double notaMaxima;
    private Long cursoId;
    private List<Long> turmaIds;

    // Construtores
    public DisciplinaDTO() {}

    public DisciplinaDTO(Long id, String nome, Integer cargaHoraria, Double notaMaxima, Long cursoId, List<Long> turmaIds) {
        this.id = id;
        this.nome = nome;
        this.cargaHoraria = cargaHoraria;
        this.notaMaxima = notaMaxima;
        this.cursoId = cursoId;
        this.turmaIds = turmaIds;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Integer getCargaHoraria() { return cargaHoraria; }
    public void setCargaHoraria(Integer cargaHoraria) { this.cargaHoraria = cargaHoraria; }
    public Double getNotaMaxima() { return notaMaxima; }
    public void setNotaMaxima(Double notaMaxima) { this.notaMaxima = notaMaxima; }
    public Long getCursoId() { return cursoId; }
    public void setCursoId(Long cursoId) { this.cursoId = cursoId; }
    public List<Long> getTurmaIds() { return turmaIds; }
    public void setTurmaIds(List<Long> turmaIds) { this.turmaIds = turmaIds; }
}
