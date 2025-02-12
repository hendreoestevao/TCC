package com.tcc.backend.dto;


public class DashboardSummaryDTO {
    private long totalAlunos;
    private long totalCursos;
    private long totalDisciplinas;
    private long totalTurmas;
    private long totalProfessores;

    // Getters e Setters
    public long getTotalAlunos() {
        return totalAlunos;
    }

    public void setTotalAlunos(long totalAlunos) {
        this.totalAlunos = totalAlunos;
    }

    public long getTotalCursos() {
        return totalCursos;
    }

    public void setTotalCursos(long totalCursos) {
        this.totalCursos = totalCursos;
    }

    public long getTotalDisciplinas() {
        return totalDisciplinas;
    }

    public void setTotalDisciplinas(long totalDisciplinas) {
        this.totalDisciplinas = totalDisciplinas;
    }

    public long getTotalTurmas() {
        return totalTurmas;
    }

    public void setTotalTurmas(long totalTurmas) {
        this.totalTurmas = totalTurmas;
    }

    public long getTotalProfessores() {
        return totalProfessores;
    }

    public void setTotalProfessores(long totalProfessores) {
        this.totalProfessores = totalProfessores;
    }
}
