package com.RPMS.demo.controller;

import com.RPMS.demo.dto.UserDto;
import com.RPMS.demo.model.User;
import com.RPMS.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" }) // React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    // Alias to support frontend that calls /api/users/all
    @GetMapping("/all")
    public List<UserDto> getAllUsersAlias() {
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
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        try {
            User user = userService.registerUser(request.getUsername(), request.getFullName(), request.getEmail(),
                    request.getEmail());
            if (request.getRoles() != null && !request.getRoles().isEmpty()) {
                userService.setUserRoles(user.getUserId(), request.getRoles());
                // refresh entity after role update
                user = userService.getUserById(user.getUserId());
            }
            return ResponseEntity.ok(user);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }

    // Bulk create candidates from parsed Excel (frontend sends JSON array)
    @PostMapping("/bulk-create")
    public ResponseEntity<BulkCreateResponse> bulkCreate(@RequestBody List<BulkCreateItem> items) {
        int created = 0;
        int skipped = 0;
        for (BulkCreateItem it : items) {
            try {
                String username = (it.getUsername() != null && !it.getUsername().isBlank()) ? it.getUsername()
                        : it.getEmail();
                String fullName = it.getFullName();
                String email = it.getEmail();
                String password = (it.getPassword() != null && !it.getPassword().isBlank()) ? it.getPassword()
                        : it.getEmail();
                if (email == null || email.isBlank()) {
                    skipped++;
                    continue;
                }
                User user = userService.registerUser(username, fullName, email, password);
                // Ensure roles include ROLE_USER and Candidate by default
                Set<String> roles = it.getRoles() != null ? it.getRoles() : Set.of("ROLE_USER", "Candidate");
                userService.setUserRoles(user.getUserId(), roles);
                created++;
            } catch (RuntimeException ex) {
                skipped++;
            }
        }
        BulkCreateResponse resp = new BulkCreateResponse();
        resp.setCreatedCount(created);
        resp.setSkippedCount(skipped);
        return ResponseEntity.ok(resp);
    }

    // Fallback DTOs (kept local to avoid missing import issues)
    public static class RoleUpdateRequest {
        private Long userId;
        private Set<String> roles;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }
    }

    public static class CreateUserRequest {
        private String username;
        private String fullName;
        private String email;
        private Set<String> roles;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }
    }

    // DTOs for bulk create
    public static class BulkCreateItem {
        private String username;
        private String fullName;
        private String email;
        private String password;
        private Set<String> roles;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Set<String> getRoles() {
            return roles;
        }

        public void setRoles(Set<String> roles) {
            this.roles = roles;
        }
    }

    public static class BulkCreateResponse {
        private int createdCount;
        private int skippedCount;

        public int getCreatedCount() {
            return createdCount;
        }

        public void setCreatedCount(int createdCount) {
            this.createdCount = createdCount;
        }

        public int getSkippedCount() {
            return skippedCount;
        }

        public void setSkippedCount(int skippedCount) {
            this.skippedCount = skippedCount;
        }
    }
}
