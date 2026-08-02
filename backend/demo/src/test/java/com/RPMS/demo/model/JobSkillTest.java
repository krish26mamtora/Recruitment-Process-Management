package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JobSkillTest {

    private JobSkill jobSkill;

    @BeforeEach
    void setUp() {
        jobSkill = new JobSkill();
        Job job = new Job();
        job.setJobId(1);
        Skill skill = new Skill();
        skill.setSkillId(1);
        jobSkill.setJob(job);
        jobSkill.setSkill(skill);
        jobSkill.setRequired(true);
    }

    @Test
    void testGettersAndSetters() {
        assertNotNull(jobSkill.getJob());
        assertNotNull(jobSkill.getSkill());
        assertTrue(jobSkill.getRequired());
    }

    @Test
    void testSetJob() {
        Job newJob = new Job();
        newJob.setJobId(2);
        jobSkill.setJob(newJob);

        assertEquals(2, jobSkill.getJob().getJobId());
    }

    @Test
    void testSetSkill() {
        Skill newSkill = new Skill();
        newSkill.setSkillId(2);
        jobSkill.setSkill(newSkill);

        assertEquals(2, jobSkill.getSkill().getSkillId());
    }

    @Test
    void testSetRequired() {
        jobSkill.setRequired(false);

        assertFalse(jobSkill.getRequired());
    }

    @Test
    void testDefaultConstructor() {
        JobSkill defaultJobSkill = new JobSkill();
        assertNotNull(defaultJobSkill);
        assertNull(defaultJobSkill.getJob());
        assertNull(defaultJobSkill.getSkill());
        assertTrue(defaultJobSkill.getRequired());
    }
}
