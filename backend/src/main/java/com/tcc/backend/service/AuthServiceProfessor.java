package com.tcc.backend.service;

import com.tcc.backend.entity.Professor;
import com.tcc.backend.repository.ProfessorRepository;
import com.tcc.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceProfessor {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public String authenticate(String username, String password) {
        Optional<Professor> optionalProfessor = professorRepository.findByUsernameAndPassword(username, password);

        if (optionalProfessor.isPresent()) {
            return jwtUtil.generateToken(username);
        } else {
            throw new RuntimeException("Credenciais inválidas");
        }
    }
}
