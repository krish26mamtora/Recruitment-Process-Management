package com.RPMS.demo.controller;

import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = "http://localhost:5173")
public class UserProfileController {

    @Autowired
    private UserProfileRepository repository;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> get(@PathVariable Long userId) {
        Optional<UserProfile> p = repository.findById(userId);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> createOrUpdate(@RequestBody UserProfile profile) {
        if (profile.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }
        UserProfile saved = repository.save(profile);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfile> update(@PathVariable Long userId, @RequestBody UserProfile profile) {
        profile.setUserId(userId);
        UserProfile saved = repository.save(profile);
        return ResponseEntity.ok(saved);
    }
}