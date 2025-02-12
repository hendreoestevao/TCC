package com.tcc.backend.service.impl;

import com.tcc.backend.entity.User;
import com.tcc.backend.repository.UserRepository;
import com.tcc.backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) {
        // Verifica se o nome de usuário já existe no banco
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("O nome de usuário já está em uso.");
        }

        // Codifica a senha do usuário
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Define a role padrão como "ROLE_ADMIN"
        user.setRole("ROLE_ADMIN");

        // Salva o usuário no banco
        return userRepository.save(user);
    }

    @Override
    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }
}
