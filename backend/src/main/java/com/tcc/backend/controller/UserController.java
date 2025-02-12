package com.tcc.backend.controller;

import com.tcc.backend.entity.User;
import com.tcc.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerAdmin(@RequestBody User user) {
        try {
            System.out.println("Tentando registrar o usuário: " + user.getUsername());

            // Verifica se o nome de usuário já existe
            if (userService.isUsernameTaken(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Username already exists");
            }

            // Registra o usuário se não existir
            userService.registerUser(user);
            return ResponseEntity.ok("Admin user registered successfully");
        } catch (Exception e) {
            System.err.println("Erro ao registrar usuário: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to register admin user");
        }
    }
}