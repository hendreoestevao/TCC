package com.tcc.backend.security;

public class AuthResponse {
    private String token;
    private String alunoId;

    public AuthResponse(String token, String alunoId) {
        this.token = token;
        this.alunoId = alunoId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getAlunoId() {
        return alunoId;
    }

    public void setAlunoId(String alunoId) {
        this.alunoId = alunoId;
    }
}
