package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobSkill;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.Skill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class JobSkillRepositoryTest {

    @Autowired
    private JobSkillRepository jobSkillRepository;

    @Autowired
    private TestEntityManager entityManager;

    private JobSkill jobSkill;

    @BeforeEach
    void setUp() {
        Job job = new Job();
        job.setTitle("Software Engineer");
        job = entityManager.persistFlushFind(job);
        
        Skill skill = new Skill();
        skill.setSkillName("Java");
        skill = entityManager.persistFlushFind(skill);

        jobSkill = new JobSkill();
        jobSkill.setJob(job);
        jobSkill.setSkill(skill);
        jobSkill.setRequired(true);
    }

    @Test
    void testSaveAndFindById() {
        JobSkill savedJobSkill = jobSkillRepository.save(jobSkill);

        assertNotNull(savedJobSkill);
        assertNotNull(savedJobSkill.getJob());
        assertNotNull(savedJobSkill.getSkill());
        assertTrue(savedJobSkill.getRequired());
    }
}
