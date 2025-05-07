package com.example.cookingapp.controller;

import com.example.cookingapp.model.Role;
import com.example.cookingapp.model.User;
import com.example.cookingapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;

import java.util.Collections;

@RestController
@CrossOrigin(origins = "http://localhost:5173")

@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard() {
        return ResponseEntity.ok("Welcome to the Admin Dashboard. You are an ADMIN!");
    }

    // Endpoint to promote a user to admin; only accessible to current admin users.
    @PostMapping("/promote/{userId}")
    public ResponseEntity<String> promoteUserToAdmin(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        // You could also append ROLE_ADMIN to existing roles if multi-role is supported.
        user.setRoles(new HashSet<>(Collections.singleton(Role.ROLE_ADMIN)));
        userRepository.save(user);
        return ResponseEntity.ok("User promoted to admin successfully.");
    }
}
