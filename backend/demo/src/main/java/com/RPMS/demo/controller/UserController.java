package com.RPMS.demo.controller;

import com.RPMS.demo.model.User;
import com.RPMS.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}) // React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Alias to support frontend that calls /api/users/all
    @GetMapping("/all")
    public List<User> getAllUsersAlias() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/role")
    public ResponseEntity<String> updateUserRole(@RequestBody RoleUpdateRequest request) {
        userService.setUserRoles(request.getUserId(), request.getRoles());
        return ResponseEntity.ok("Role updated successfully");
    }

    // New endpoint to support PUT /api/users/{id}/roles used by AdminUsers.jsx
    @PutMapping("/{id}/roles")
    public ResponseEntity<String> updateUserRolesPut(@PathVariable("id") Long userId,
                                                     @RequestBody RoleUpdateRequest request) {
        userService.setUserRoles(userId, request.getRoles());
        return ResponseEntity.ok("Roles updated successfully");
    }

    // New endpoint to support POST /api/users/create
    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        // As per UI note: initial password equals email
        User user = userService.registerUser(request.getUsername(), request.getFullName(), request.getEmail(), request.getEmail());
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            userService.setUserRoles(user.getUserId(), request.getRoles());
            // refresh entity after role update
            user = userService.getUserById(user.getUserId());
        }
        return ResponseEntity.ok(user);
    }

    // Fallback DTOs (kept local to avoid missing import issues)
    public static class RoleUpdateRequest {
        private Long userId;
        private Set<String> roles;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }

    public static class CreateUserRequest {
        private String username;
        private String fullName;
        private String email;
        private Set<String> roles;
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
    }
}
