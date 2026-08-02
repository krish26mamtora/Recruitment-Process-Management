package com.RPMS.demo.service;

import com.RPMS.demo.dto.InterviewDetailsDTO;
import com.RPMS.demo.model.*;
import com.RPMS.demo.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobApplicationServiceTest {

    @Mock
    private JobApplicationRepository jobApplicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private InterviewPanelRepository interviewPanelRepository;

    @Mock
    private InterviewFeedbackRepository interviewFeedbackRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private JobApplicationService jobApplicationService;

    private Job job;
    private User user;
    private JobApplication jobApplication;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setJobId(1);
        job.setTitle("Software Engineer");

        user = new User();
        user.setUserId(1L);
        user.setEmail("candidate@example.com");
        user.setFullName("John Doe");

        jobApplication = new JobApplication();
        jobApplication.setId(1);
        jobApplication.setFullName("John Doe");
        jobApplication.setEmail("candidate@example.com");
        jobApplication.setPhone("1234567890");
        jobApplication.setStatus("Pending");
    }

    @Test
    void testGetAllApplications() {
        when(jobApplicationRepository.findAll()).thenReturn(Arrays.asList(jobApplication));

        List<JobApplication> applications = jobApplicationService.getAllApplications();

        assertNotNull(applications);
        assertEquals(1, applications.size());
        assertEquals("John Doe", applications.get(0).getFullName());
    }

    @Test
    void testGetApplicationsByJobId() {
        when(jobApplicationRepository.findByJobIdFk(1)).thenReturn(Arrays.asList(jobApplication));

        List<JobApplication> applications = jobApplicationService.getApplicationsByJobId(1);

        assertNotNull(applications);
        assertEquals(1, applications.size());
    }

    @Test
    void testGetApplicationsByCandidateId() {
        when(jobApplicationRepository.findByCandidate_UserId(1L)).thenReturn(Arrays.asList(jobApplication));

        List<JobApplication> applications = jobApplicationService.getApplicationsByCandidateId(1L);

        assertNotNull(applications);
        assertEquals(1, applications.size());
    }

    @Test
    void testGetApplicationById() {
        when(jobApplicationRepository.findById(1)).thenReturn(Optional.of(jobApplication));

        JobApplication foundApplication = jobApplicationService.getApplicationById(1L);

        assertNotNull(foundApplication);
        assertEquals("John Doe", foundApplication.getFullName());
    }

    @Test
    void testGetApplicationByIdNotFound() {
        when(jobApplicationRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobApplicationService.getApplicationById(1L));
    }

    @Test
    void testMapCandidateToJob() {
        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userProfileRepository.findById(1L)).thenReturn(Optional.empty());
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplication mappedApplication = jobApplicationService.mapCandidateToJob(1, 1L);

        assertNotNull(mappedApplication);
        verify(jobApplicationRepository, times(1)).save(any(JobApplication.class));
        verify(eventPublisher, times(1)).publishEvent(any(Object.class));
    }

    @Test
    void testScheduleInterview() {
        jobApplication.setJob(job);
        jobApplication.setCandidate(user);
        when(jobApplicationRepository.findById(1)).thenReturn(Optional.of(jobApplication));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplication scheduledApplication = jobApplicationService.scheduleInterview(
                1L,
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                Arrays.asList("interviewer@example.com")
        );

        assertNotNull(scheduledApplication);
        verify(jobApplicationRepository, times(1)).save(any(JobApplication.class));
        verify(eventPublisher, times(1)).publishEvent(any(Object.class));
    }

    @Test
    void testUpdateApplicationStatus() {
        jobApplication.setJob(job);
        jobApplication.setCandidate(user);
        when(jobApplicationRepository.findById(1)).thenReturn(Optional.of(jobApplication));
        when(jobApplicationRepository.save(any(JobApplication.class))).thenReturn(jobApplication);

        JobApplication updatedApplication = jobApplicationService.updateApplicationStatus(1L, "SELECTED", "Great candidate");

        assertNotNull(updatedApplication);
        verify(jobApplicationRepository, times(1)).save(any(JobApplication.class));
        verify(eventPublisher, times(1)).publishEvent(any(Object.class));
    }

    @Test
    void testGetAllScheduledInterviews() {
        jobApplication.setStatus("Interview - Technical scheduled");
        jobApplication.setRemarks("Round: Technical, When: 2024-01-15T10:00:00, Meet: https://meet.google.com/abc");
        jobApplication.setJob(job);
        when(jobApplicationRepository.findAll()).thenReturn(Arrays.asList(jobApplication));
        when(interviewPanelRepository.findByApplicationId(1)).thenReturn(Arrays.asList());

        List<InterviewDetailsDTO> interviews = jobApplicationService.getAllScheduledInterviews();

        assertNotNull(interviews);
        assertEquals(1, interviews.size());
    }

    @Test
    void testAddFeedback() {
        jobApplication.setJob(job);
        when(jobApplicationRepository.findById(1)).thenReturn(Optional.of(jobApplication));
        when(interviewFeedbackRepository.save(any(InterviewFeedback.class))).thenReturn(new InterviewFeedback());

        InterviewFeedback feedback = jobApplicationService.addFeedback(
                1,
                "Technical Round",
                "John Smith",
                "Good skills",
                "{\"technical\":8}"
        );

        assertNotNull(feedback);
        verify(interviewFeedbackRepository, times(1)).save(any(InterviewFeedback.class));
        verify(emailService, times(1)).sendInterviewFeedbackEmail(
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString(),
                anyString()
        );
    }

    @Test
    void testGetFeedbackByApplicationId() {
        InterviewFeedback feedback = new InterviewFeedback();
        feedback.setRound("Technical Round");
        when(interviewFeedbackRepository.findByJobApplication_Id(1)).thenReturn(Arrays.asList(feedback));

        List<InterviewFeedback> feedbacks = jobApplicationService.getFeedbackByApplicationId(1);

        assertNotNull(feedbacks);
        assertEquals(1, feedbacks.size());
        assertEquals("Technical Round", feedbacks.get(0).getRound());
    }
}
