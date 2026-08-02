package com.RPMS.demo.repository;

import com.RPMS.demo.model.JobSkill;
import com.RPMS.demo.model.JobSkillId;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.Skill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class JobSkillRepositoryTest {

    @Autowired
    private JobSkillRepository jobSkillRepository;

    private JobSkill jobSkill;

    @BeforeEach
    void setUp() {
        Job job = new Job();
        job.setJobId(1);
        
        Skill skill = new Skill();
        skill.setSkillId(1);

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
