package com.RPMS.demo.repository;

import com.RPMS.demo.model.InterviewPanel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class InterviewPanelRepositoryTest {

    @Autowired
    private InterviewPanelRepository interviewPanelRepository;

    private InterviewPanel interviewPanel;

    @BeforeEach
    void setUp() {
        interviewPanel = new InterviewPanel();
        interviewPanel.setApplicationId(1);
        interviewPanel.setInterviewerEmail("interviewer@example.com");
    }

    @Test
    void testSaveAndFindById() {
        InterviewPanel savedPanel = interviewPanelRepository.save(interviewPanel);

        assertNotNull(savedPanel);
        assertNotNull(savedPanel.getId());
        assertEquals(1, savedPanel.getApplicationId());
        assertEquals("interviewer@example.com", savedPanel.getInterviewerEmail());
    }

    @Test
    void testFindByApplicationId() {
        interviewPanelRepository.save(interviewPanel);

        List<InterviewPanel> foundPanels = interviewPanelRepository.findByApplicationId(1);

        assertNotNull(foundPanels);
        assertFalse(foundPanels.isEmpty());
        assertEquals(1, foundPanels.get(0).getApplicationId());
    }

    @Test
    void testDeleteByApplicationId() {
        interviewPanelRepository.save(interviewPanel);

        interviewPanelRepository.deleteByApplicationId(1);

        List<InterviewPanel> foundPanels = interviewPanelRepository.findByApplicationId(1);
        assertTrue(foundPanels.isEmpty());
    }
}
