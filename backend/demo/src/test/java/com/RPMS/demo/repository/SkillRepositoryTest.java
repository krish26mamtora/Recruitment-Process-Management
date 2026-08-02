package com.RPMS.demo.repository;

import com.RPMS.demo.model.Skill;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class SkillRepositoryTest {

    @Autowired
    private SkillRepository skillRepository;

    private Skill skill;

    @BeforeEach
    void setUp() {
        skill = new Skill();
        skill.setSkillName("Java");
        skill.setDescription("Java programming language");
    }

    @Test
    void testSaveAndFindById() {
        Skill savedSkill = skillRepository.save(skill);

        assertNotNull(savedSkill);
        assertNotNull(savedSkill.getSkillId());
        assertEquals("Java", savedSkill.getSkillName());
    }

    @Test
    void testExistsBySkillName() {
        skillRepository.save(skill);

        boolean exists = skillRepository.existsBySkillName("Java");

        assertTrue(exists);
    }

    @Test
    void testExistsBySkillNameNotFound() {
        boolean exists = skillRepository.existsBySkillName("NonExistentSkill");

        assertFalse(exists);
    }
}
