package com.RPMS.demo.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

public class InterviewFeedbackDTOTest {

    private InterviewFeedbackDTO dto;

    @BeforeEach
    void setUp() {
        dto = new InterviewFeedbackDTO();
        dto.setId(1L);
        dto.setApplicationId(1);
        dto.setRound("Technical Round");
        dto.setInterviewerName("John Smith");
        dto.setComments("Good technical skills");
        dto.setRatingsJson("{\"technical\":8,\"communication\":7}");
        dto.setCreatedAt(Instant.parse("2024-01-15T10:00:00Z"));
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, dto.getId());
        assertEquals(1, dto.getApplicationId());
        assertEquals("Technical Round", dto.getRound());
        assertEquals("John Smith", dto.getInterviewerName());
        assertEquals("Good technical skills", dto.getComments());
        assertEquals("{\"technical\":8,\"communication\":7}", dto.getRatingsJson());
        assertEquals(Instant.parse("2024-01-15T10:00:00Z"), dto.getCreatedAt());
    }

    @Test
    void testDefaultConstructor() {
        InterviewFeedbackDTO defaultDto = new InterviewFeedbackDTO();
        assertNotNull(defaultDto);
        assertNull(defaultDto.getId());
        assertNull(defaultDto.getApplicationId());
    }

    @Test
    void testSettersUpdateFields() {
        dto.setId(2L);
        dto.setApplicationId(2);
        dto.setRound("HR Round");
        dto.setInterviewerName("Jane Doe");
        dto.setComments("Excellent communication");
        dto.setRatingsJson("{\"communication\":9}");

        assertEquals(2L, dto.getId());
        assertEquals(2, dto.getApplicationId());
        assertEquals("HR Round", dto.getRound());
        assertEquals("Jane Doe", dto.getInterviewerName());
        assertEquals("Excellent communication", dto.getComments());
        assertEquals("{\"communication\":9}", dto.getRatingsJson());
    }
}
