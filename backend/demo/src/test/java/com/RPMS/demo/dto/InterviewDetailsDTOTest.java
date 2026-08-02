package com.RPMS.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class InterviewDetailsDTOTest {

    private InterviewDetailsDTO dto;

    @BeforeEach
    void setUp() {
        List<String> interviewerEmails = Arrays.asList("interviewer1@example.com", "interviewer2@example.com");
        dto = new InterviewDetailsDTO(
                1L,
                "John Doe",
                "john@example.com",
                "Software Engineer",
                1,
                "Technical Round",
                "2024-01-15T10:00:00",
                "https://meet.google.com/abc-defg-hij",
                "Please join on time",
                "SCHEDULED",
                interviewerEmails
        );
    }

    @Test
    void testConstructorAndGetters() {
        assertEquals(1L, dto.getApplicationId());
        assertEquals("John Doe", dto.getCandidateName());
        assertEquals("john@example.com", dto.getCandidateEmail());
        assertEquals("Software Engineer", dto.getJobTitle());
        assertEquals(1, dto.getJobId());
        assertEquals("Technical Round", dto.getRound());
        assertEquals("2024-01-15T10:00:00", dto.getScheduledAt());
        assertEquals("https://meet.google.com/abc-defg-hij", dto.getMeetLink());
        assertEquals("Please join on time", dto.getMessage());
        assertEquals("SCHEDULED", dto.getStatus());
        assertEquals(2, dto.getInterviewerEmails().size());
    }

    @Test
    void testSetters() {
        dto.setApplicationId(2L);
        dto.setCandidateName("Jane Doe");
        dto.setCandidateEmail("jane@example.com");
        dto.setJobTitle("Senior Developer");
        dto.setJobId(2);
        dto.setRound("HR Round");
        dto.setScheduledAt("2024-01-16T14:00:00");
        dto.setMeetLink("https://meet.google.com/xyz-uvw-rst");
        dto.setMessage("Final round");
        dto.setStatus("PENDING");

        assertEquals(2L, dto.getApplicationId());
        assertEquals("Jane Doe", dto.getCandidateName());
        assertEquals("jane@example.com", dto.getCandidateEmail());
        assertEquals("Senior Developer", dto.getJobTitle());
        assertEquals(2, dto.getJobId());
        assertEquals("HR Round", dto.getRound());
        assertEquals("2024-01-16T14:00:00", dto.getScheduledAt());
        assertEquals("https://meet.google.com/xyz-uvw-rst", dto.getMeetLink());
        assertEquals("Final round", dto.getMessage());
        assertEquals("PENDING", dto.getStatus());
    }

    @Test
    void testDefaultConstructor() {
        InterviewDetailsDTO defaultDto = new InterviewDetailsDTO();
        assertNotNull(defaultDto);
        assertNull(defaultDto.getApplicationId());
        assertNull(defaultDto.getCandidateName());
    }
}
