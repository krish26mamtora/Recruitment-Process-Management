package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SkillTest {

    private Skill skill;

    @BeforeEach
    void setUp() {
        skill = new Skill();
        skill.setSkillId(1);
        skill.setSkillName("Java");
        skill.setDescription("Java programming language");
        skill.setJobSkills(new HashSet<>());
    }

    @Test
    void testGettersAndSetters() {
        assertEquals(1, skill.getSkillId());
        assertEquals("Java", skill.getSkillName());
        assertEquals("Java programming language", skill.getDescription());
        assertNotNull(skill.getJobSkills());
    }

    @Test
    void testSetSkillId() {
        skill.setSkillId(2);

        assertEquals(2, skill.getSkillId());
    }

    @Test
    void testSetSkillName() {
        skill.setSkillName("Python");

        assertEquals("Python", skill.getSkillName());
    }

    @Test
    void testSetDescription() {
        skill.setDescription("Python programming language");

        assertEquals("Python programming language", skill.getDescription());
    }

    @Test
    void testSetJobSkills() {
        Set<JobSkill> jobSkills = new HashSet<>();
        JobSkill jobSkill = new JobSkill();
        jobSkills.add(jobSkill);
        skill.setJobSkills(jobSkills);

        assertEquals(1, skill.getJobSkills().size());
    }

    @Test
    void testDefaultConstructor() {
        Skill defaultSkill = new Skill();
        assertNotNull(defaultSkill);
        assertNull(defaultSkill.getSkillId());
        assertNull(defaultSkill.getSkillName());
        assertNull(defaultSkill.getDescription());
    }
}
