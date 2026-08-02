package com.RPMS.demo.controller;

import com.RPMS.demo.dto.InterviewFeedbackDTO;
import com.RPMS.demo.model.InterviewFeedback;
import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.service.JobApplicationService;
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
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(JobApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class JobApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JobApplicationService jobApplicationService;

    @Autowired
    private ObjectMapper objectMapper;

    private JobApplication sampleApplication;

    @BeforeEach
    void setUp() {
        sampleApplication = new JobApplication();
        sampleApplication.setId(1);
        sampleApplication.setFullName("John Doe");
        sampleApplication.setEmail("john@example.com");
        sampleApplication.setPhone("1234567890");
        sampleApplication.setStatus("Pending");
    }

    @Test
    void testGetAllApplications() throws Exception {
        Mockito.when(jobApplicationService.getAllApplications()).thenReturn(Arrays.asList(sampleApplication));

        mockMvc.perform(get("/api/job-applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("John Doe"));
    }

    @Test
    void testGetApplicationsByJob() throws Exception {
        Mockito.when(jobApplicationService.getApplicationsByJobId(1)).thenReturn(Arrays.asList(sampleApplication));

        mockMvc.perform(get("/api/job-applications/job/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("John Doe"));
    }

    @Test
    void testGetApplicationsByCandidate() throws Exception {
        Mockito.when(jobApplicationService.getApplicationsByCandidateId(1L)).thenReturn(Arrays.asList(sampleApplication));

        mockMvc.perform(get("/api/job-applications/candidate/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fullName").value("John Doe"));
    }

    @Test
    void testMapCandidateToJob() throws Exception {
        JobApplicationController.MapRequest request = new JobApplicationController.MapRequest();
        request.jobId = 1;
        request.candidateId = 1L;

        Mockito.when(jobApplicationService.mapCandidateToJob(1, 1L)).thenReturn(sampleApplication);

        mockMvc.perform(post("/api/job-applications/map")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe"));
    }

    @Test
    void testScheduleInterview() throws Exception {
        JobApplicationController.ScheduleInterviewRequest request = new JobApplicationController.ScheduleInterviewRequest();
        request.round = "Technical Round";
        request.scheduledAt = "2024-01-15T10:00:00";
        request.meetLink = "https://meet.google.com/abc-defg-hij";
        request.message = "Please join on time";
        request.interviewerEmails = Arrays.asList("interviewer@example.com");

        Mockito.when(jobApplicationService.scheduleInterview(anyLong(), any(), any(), any(), any(), any()))
                .thenReturn(sampleApplication);

        mockMvc.perform(post("/api/job-applications/1/schedule-interview")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe"));
    }

    @Test
    void testUpdateStatus() throws Exception {
        JobApplicationController.UpdateStatusRequest request = new JobApplicationController.UpdateStatusRequest();
        request.status = "SELECTED";
        request.remarks = "Great candidate";

        Mockito.when(jobApplicationService.updateApplicationStatus(anyLong(), any(), any()))
                .thenReturn(sampleApplication);

        mockMvc.perform(post("/api/job-applications/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("John Doe"));
    }

    @Test
    void testAddFeedback() throws Exception {
        JobApplicationController.FeedbackRequest request = new JobApplicationController.FeedbackRequest();
        request.round = "Technical Round";
        request.interviewerName = "John Smith";
        request.comments = "Good skills";
        request.ratingsJson = "{\"technical\":8}";

        JobApplication feedbackApplication = new JobApplication();
        feedbackApplication.setId(1);

        InterviewFeedback feedback = new InterviewFeedback();
        feedback.setId(1L);
        feedback.setJobApplication(feedbackApplication);
        feedback.setRound("Technical Round");
        feedback.setInterviewerName("John Smith");
        feedback.setComments("Good skills");
        feedback.setRatingsJson("{\"technical\":8}");

        Mockito.when(jobApplicationService.addFeedback(any(), any(), any(), any(), any()))
                .thenReturn(feedback);

        mockMvc.perform(post("/api/job-applications/1/feedback")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetScheduledInterviews() throws Exception {
        com.RPMS.demo.dto.InterviewDetailsDTO dto = new com.RPMS.demo.dto.InterviewDetailsDTO(
                1L,
                "John Doe",
                "john@example.com",
                "Software Engineer",
                1,
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                "Interview - Technical scheduled",
                Arrays.asList("interviewer@example.com")
        );

        Mockito.when(jobApplicationService.getAllScheduledInterviews()).thenReturn(Arrays.asList(dto));

        mockMvc.perform(get("/api/job-applications/scheduled-interviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].candidateName").value("John Doe"));
    }
}
