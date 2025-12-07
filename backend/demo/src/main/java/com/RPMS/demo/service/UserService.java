package com.RPMS.demo.service;

import com.RPMS.demo.dto.LoginResponse;
import com.RPMS.demo.dto.UserDto;
import com.RPMS.demo.model.Role;
import com.RPMS.demo.model.User;
import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.repository.RoleRepository;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import java.util.HashSet;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
            UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userProfileRepository = userProfileRepository;
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

        User savedUser = userRepository.save(user);

        // Create an empty UserProfile for the new user
        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(savedUser.getUserId());
        userProfile.setFullName(savedUser.getFullName());
        userProfile.setEmail(savedUser.getEmail());
        userProfileRepository.save(userProfile);

        return savedUser;
    }

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Long> userIds = users.stream().map(User::getUserId).collect(Collectors.toList());

        Map<Long, UserProfile> profiles = userProfileRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(UserProfile::getUserId, Function.identity()));

        List<UserDto> dtos = new ArrayList<>();
        for (User user : users) {
            UserDto dto = new UserDto();
            dto.setUserId(user.getUserId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setFullName(user.getFullName());
            dto.setStatus(user.getStatus());
            dto.setCreatedAt(user.getCreatedAt());
            dto.setRoles(user.getRoles());

            UserProfile profile = profiles.get(user.getUserId());
            if (profile != null) {
                dto.setResumeFileName(profile.getResumeFileName());
            }

            dtos.add(dto);
        }
        return dtos;
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
            return new LoginResponse(false, "User not found", null, null, null, null);
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return new LoginResponse(false, "Invalid password", null, null, null, null);
        }

        // Convert user roles to string set
        Set<String> roleNames = new HashSet<>();
        for (Role role : user.getRoles()) {
            roleNames.add(role.getRoleName());
        }

        return new LoginResponse(true, "Login successful", user.getFullName(), roleNames, user.getUserId(),
                user.getEmail());
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    public User setUserRoles(Long userId, Set<String> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            Role role = roleRepository.findByRoleName(roleName)
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName(roleName);
                        return roleRepository.save(newRole);
                    });
            roles.add(role);
        }
        user.setRoles(roles);
        return userRepository.save(user);
    }

}
