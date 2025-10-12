package com.RPMS.demo.service;

import com.RPMS.demo.dto.LoginResponse;
import com.RPMS.demo.model.Role;
import com.RPMS.demo.model.User;
import com.RPMS.demo.repository.RoleRepository;
import com.RPMS.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User registerUser(String username, String fullName, String email, String password) {
        // Check if username or email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }

        // Create user
        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setStatus(User.Status.active);

        // Assign default role (ROLE_USER)
        Optional<Role> roleUser = roleRepository.findByRoleName("ROLE_USER");
        Set<Role> roles = new HashSet<>();
        roleUser.ifPresent(roles::add);
        user.setRoles(roles);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 2️⃣ Get user by username
    public User getUserByUsername(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            throw new RuntimeException("User not found with username: " + username);
        }
    }

    public LoginResponse loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return new LoginResponse(false, "User not found", null, null);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return new LoginResponse(false, "Invalid password", null, null);
        }

        // Convert user roles to string set
        Set<String> roleNames = new HashSet<>();
        for (Role role : user.getRoles()) {
            roleNames.add(role.getRoleName());
        }

        return new LoginResponse(true, "Login successful", user.getFullName(), roleNames);
    }

}
