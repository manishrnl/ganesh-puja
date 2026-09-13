package com.example.andah_ganesh_puja.controller;

import com.example.andah_ganesh_puja.entity.ProfileEntity;
import com.example.andah_ganesh_puja.entity.enums.Role;
import com.example.andah_ganesh_puja.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");
        String fullName = payload.get("fullName");
        String email = payload.get("email");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }

        ProfileEntity profileEntity = new ProfileEntity();
        profileEntity.setUsername(username);
        profileEntity.setPassword(passwordEncoder.encode(password));
        profileEntity.setFullName(fullName);
        profileEntity.setEmail(email);
        profileEntity.setRole(Role.PUBLIC);

        userRepository.save(profileEntity);
        return ResponseEntity.ok(Map.of("message", "User registered successfully, ROLE : PUBLIC"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        Optional<ProfileEntity> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }

        ProfileEntity profileEntity = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "username", profileEntity.getUsername(),
                "role", profileEntity.getRole().name(),
                "fullName", profileEntity.getFullName()
        ));
    }
}
