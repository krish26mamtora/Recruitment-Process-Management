package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class CandidateResumeParsedTest {

    private CandidateResumeParsed candidateResumeParsed;

    @BeforeEach
    void setUp() {
        candidateResumeParsed = new CandidateResumeParsed();
        candidateResumeParsed.setId(1L);
        candidateResumeParsed.setExtractedSkills(Arrays.asList("Java", "Spring", "React"));
        candidateResumeParsed.setExtractedExperienceYears(5.0);
        candidateResumeParsed.setParsedAt(Instant.now());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1L, candidateResumeParsed.getId());
        assertEquals(3, candidateResumeParsed.getExtractedSkills().size());
        assertTrue(candidateResumeParsed.getExtractedSkills().contains("Java"));
        assertEquals(5.0, candidateResumeParsed.getExtractedExperienceYears());
        assertNotNull(candidateResumeParsed.getParsedAt());
    }

    @Test
    void testSetJobApplication() {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setId(1);
        candidateResumeParsed.setJobApplication(jobApplication);

        assertEquals(jobApplication, candidateResumeParsed.getJobApplication());
    }

    @Test
    void testSetExtractedSkills() {
        List<String> newSkills = Arrays.asList("Python", "Django", "AWS");
        candidateResumeParsed.setExtractedSkills(newSkills);

        assertEquals(3, candidateResumeParsed.getExtractedSkills().size());
        assertTrue(candidateResumeParsed.getExtractedSkills().contains("Python"));
    }

    @Test
    void testSetExtractedExperienceYears() {
        candidateResumeParsed.setExtractedExperienceYears(3.5);

        assertEquals(3.5, candidateResumeParsed.getExtractedExperienceYears());
    }

    @Test
    void testDefaultConstructor() {
        CandidateResumeParsed defaultParsed = new CandidateResumeParsed();
        assertNotNull(defaultParsed);
        assertNull(defaultParsed.getId());
        assertNull(defaultParsed.getExtractedSkills());
    }
}
