package com.tcc.backend.service;

import com.tcc.backend.entity.Aluno;
import com.tcc.backend.repository.AlunoRepository;
import com.tcc.backend.security.JwtUtil;
import com.tcc.backend.security.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceAluno {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse authenticate(String ra, String senha) {
        Aluno aluno = alunoRepository.findByRa(ra);
        if (aluno != null && new BCryptPasswordEncoder().matches(senha, aluno.getSenha())) {
            String token = jwtUtil.generateToken(aluno.getRa());
            return new AuthResponse(token, aluno.getRa());
        } else {
            throw new RuntimeException("Credenciais inválidas");
        }
    }
}
