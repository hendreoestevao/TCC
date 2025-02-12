package com.tcc.backend.dto;

public class TurmaDTO {
    private Long id;
    private String periodo;

    public TurmaDTO(Long id, String periodo) {
        this.id = id;
        this.periodo = periodo;
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
}
