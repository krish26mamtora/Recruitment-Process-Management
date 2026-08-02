package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class InterviewPanelTest {

    private InterviewPanel interviewPanel;

    @BeforeEach
    void setUp() {
        interviewPanel = new InterviewPanel();
        interviewPanel.setId(1L);
        interviewPanel.setApplicationId(1);
        interviewPanel.setInterviewerEmail("interviewer@example.com");
    }

    @Test
    void testConstructorWithParameters() {
        InterviewPanel panel = new InterviewPanel(2, "interviewer2@example.com");

        assertEquals(2, panel.getApplicationId());
        assertEquals("interviewer2@example.com", panel.getInterviewerEmail());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, interviewPanel.getId());
        assertEquals(1, interviewPanel.getApplicationId());
        assertEquals("interviewer@example.com", interviewPanel.getInterviewerEmail());
    }

    @Test
    void testSetId() {
        interviewPanel.setId(2L);

        assertEquals(2L, interviewPanel.getId());
    }

    @Test
    void testSetApplicationId() {
        interviewPanel.setApplicationId(3);

        assertEquals(3, interviewPanel.getApplicationId());
    }

    @Test
    void testSetInterviewerEmail() {
        interviewPanel.setInterviewerEmail("new@example.com");

        assertEquals("new@example.com", interviewPanel.getInterviewerEmail());
    }

    @Test
    void testDefaultConstructor() {
        InterviewPanel defaultPanel = new InterviewPanel();
        assertNotNull(defaultPanel);
        assertNull(defaultPanel.getId());
        assertNull(defaultPanel.getApplicationId());
        assertNull(defaultPanel.getInterviewerEmail());
    }
}
