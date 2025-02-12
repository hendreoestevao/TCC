package com.tcc.backend.service;

import com.tcc.backend.entity.User;

public interface UserService {
    boolean isUsernameTaken(String username);
    User registerUser(User user);
}