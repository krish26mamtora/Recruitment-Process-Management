package com.RPMS.demo.controller;

import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.repository.UserRepository;
import com.RPMS.demo.repository.RoleRepository;
import com.RPMS.demo.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResumeParseController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ResumeParseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserProfileRepository userProfileRepository;

    @MockBean
    private UserService userService;

    @MockBean
    private RoleRepository roleRepository;

    @Test
    void testParseResume_NoFile() throws Exception {
        mockMvc.perform(multipart("/api/resume/parse"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testParseResume_WithFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                "Sample resume content".getBytes()
        );

        mockMvc.perform(multipart("/api/resume/parse")
                .file(file))
                .andExpect(status().isOk());
    }
}
