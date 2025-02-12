package com.tcc.backend.security;

import com.tcc.backend.entity.User;
import com.tcc.backend.entity.Aluno;
import com.tcc.backend.repository.UserRepository;
import com.tcc.backend.repository.AlunoRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final AlunoRepository alunoRepository;

    public UserDetailsServiceImpl(UserRepository userRepository, AlunoRepository alunoRepository) {
        this.userRepository = userRepository;
        this.alunoRepository = alunoRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Attempting to load user: " + username);

        User user = userRepository.findByUsername(username);
        if (user != null) {
            System.out.println("User found in 'users' table: " + user.getUsername());
            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getUsername())
                    .password(user.getPassword())
                    .authorities(List.of(new SimpleGrantedAuthority(user.getRole())))
                    .build();
        }


        Aluno aluno = alunoRepository.findByRa(username);
        if (aluno != null) {
            System.out.println("User found in 'alunos' table: " + aluno.getRa());
            return org.springframework.security.core.userdetails.User
                    .withUsername(aluno.getRa())
                    .password(aluno.getSenha())
                    .authorities(List.of(new SimpleGrantedAuthority("ROLE_ALUNO")))
                    .build();
        }

        System.out.println("User not found: " + username);
        throw new UsernameNotFoundException("User not found");
    }
}
