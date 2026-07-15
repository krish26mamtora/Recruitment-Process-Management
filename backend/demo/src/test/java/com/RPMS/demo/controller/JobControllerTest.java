package com.RPMS.demo.controller;

import com.RPMS.demo.model.Job;
import com.RPMS.demo.repository.JobRepository;
import com.RPMS.demo.service.JobService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobController.class)
@AutoConfigureMockMvc(addFilters = false)
public class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobRepository jobRepository;

    @MockBean
    private JobService jobService;

    @Autowired
    private ObjectMapper objectMapper;

    private Job sampleJob;

    @BeforeEach
    void setUp() {
        sampleJob = new Job();
        sampleJob.setJobId(1); // Fixed here to match getJobId/setJobId
        sampleJob.setTitle("Software Engineer");
        sampleJob.setDescription("Java & Spring Boot role");
        sampleJob.setStatus("OPEN");
        sampleJob.setMinExperienceYears(2);
    }

    @Test
    void testGetAllJobs() throws Exception {
        Mockito.when(jobRepository.findAll()).thenReturn(Arrays.asList(sampleJob));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].jobId").value(1)) // Checked against jobId field
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void testCreateJob() throws Exception {
        Mockito.when(jobService.createJob(any(Job.class))).thenReturn(sampleJob);

        mockMvc.perform(post("/api/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleJob)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value(1))
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void testGetJobById_Found() throws Exception {
        Mockito.when(jobRepository.findById(1)).thenReturn(Optional.of(sampleJob));

        mockMvc.perform(get("/api/jobs/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jobId").value(1))
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void testDeleteJob() throws Exception {
        Mockito.doNothing().when(jobRepository).deleteById(1);

        mockMvc.perform(delete("/api/jobs/1"))
                .andExpect(status().isOk());
    }
}