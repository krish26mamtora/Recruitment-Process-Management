package com.RPMS.demo.controller;

import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.model.User;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserProfileController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserProfileRepository userProfileRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private UserProfile sampleProfile;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User();
        sampleUser.setUserId(1L);
        sampleUser.setFullName("Test User");
        sampleUser.setEmail("test@example.com");

        sampleProfile = new UserProfile();
        sampleProfile.setUserId(1L);
        sampleProfile.setFullName("Test User");
        sampleProfile.setEmail("test@example.com");
    }

    @Test
    void testGetUserProfile() throws Exception {
        Mockito.when(userProfileRepository.findById(1L)).thenReturn(Optional.of(sampleProfile));

        mockMvc.perform(get("/api/user-profiles/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.fullName").value("Test User"));
    }

    @Test
    void testUpsertUserProfile() throws Exception {
        Mockito.when(userProfileRepository.findById(1L)).thenReturn(Optional.empty());
        Mockito.when(userProfileRepository.save(any(UserProfile.class))).thenReturn(sampleProfile);

        mockMvc.perform(post("/api/user-profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleProfile)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1));
    }
}
