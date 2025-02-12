package com.tcc.backend.security;

import com.tcc.backend.entity.Role;
import com.tcc.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RoleUtil {

    @Autowired
    private RoleRepository roleRepository;

    public Role getOrCreateAlunoRole() {
        Role role = roleRepository.findByName("ALUNO");
        if (role == null) {
            role = new Role();
            role.setName("ALUNO");
            role = roleRepository.save(role);
        }
        return role;
    }
}
