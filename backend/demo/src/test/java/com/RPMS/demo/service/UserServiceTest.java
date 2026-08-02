package com.RPMS.demo.service;

import com.RPMS.demo.dto.LoginResponse;
import com.RPMS.demo.dto.UserDto;
import com.RPMS.demo.model.Role;
import com.RPMS.demo.model.User;
import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.repository.RoleRepository;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private Role role;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setPasswordHash("hashedpassword");
        user.setFullName("Test User");
        user.setStatus(User.Status.active);

        role = new Role();
        role.setRoleId(1L);
        role.setRoleName("ROLE_USER");
    }

    @Test
    void testRegisterUser_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName("ROLE_USER")).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(new UserProfile());

        User registeredUser = userService.registerUser("testuser", "Test User", "test@example.com", "password");

        assertNotNull(registeredUser);
        assertEquals("testuser", registeredUser.getUsername());
        verify(userRepository, times(1)).save(any(User.class));
        verify(userProfileRepository, times(1)).save(any(UserProfile.class));
    }

    @Test
    void testRegisterUser_EmailAlreadyExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> userService.registerUser("testuser", "Test User", "test@example.com", "password"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegisterUser_UsernameAlreadyExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        assertThrows(RuntimeException.class, () -> userService.registerUser("testuser", "Test User", "test@example.com", "password"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        when(userProfileRepository.findAllById(any(List.class))).thenReturn(new ArrayList<>());

        List<UserDto> users = userService.getAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        assertEquals("testuser", users.get(0).getUsername());
    }

    @Test
    void testGetUserByUsername() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        User foundUser = userService.getUserByUsername("testuser");

        assertNotNull(foundUser);
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void testGetUserByUsernameNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserByUsername("nonexistent"));
    }

    @Test
    void testLoginUser_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        LoginResponse response = userService.loginUser("test@example.com", "password");

        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
    }

    @Test
    void testLoginUser_UserNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        LoginResponse response = userService.loginUser("nonexistent@example.com", "password");

        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertEquals("User not found", response.getMessage());
    }

    @Test
    void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.getUserById(1L);

        assertNotNull(foundUser);
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    void testGetUserByIdNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(1L));
    }

    @Test
    void testSetUserRoles() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findByRoleName("ROLE_ADMIN")).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updatedUser = userService.setUserRoles(1L, Set.of("ROLE_ADMIN"));

        assertNotNull(updatedUser);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testSetUserRoles_CreateNewRole() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findByRoleName("NEW_ROLE")).thenReturn(Optional.empty());
        when(roleRepository.save(any(Role.class))).thenReturn(role);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updatedUser = userService.setUserRoles(1L, Set.of("NEW_ROLE"));

        assertNotNull(updatedUser);
        verify(roleRepository, times(1)).save(any(Role.class));
        verify(userRepository, times(1)).save(any(User.class));
    }
}
