package com.tcc.backend.dto;

public class AlunoNotaFaltaDTO {
    private DisciplinaDTO disciplina;
    private Double nota;
    private Integer faltas;

    public AlunoNotaFaltaDTO(DisciplinaDTO disciplina, Double nota, Integer faltas) {
        this.disciplina = disciplina;
        this.nota = nota;
        this.faltas = faltas;
    }

    public DisciplinaDTO getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(DisciplinaDTO disciplina) {
        this.disciplina = disciplina;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }

    public Integer getFaltas() {
        return faltas;
    }

    public void setFaltas(Integer faltas) {
        this.faltas = faltas;
    }
}
