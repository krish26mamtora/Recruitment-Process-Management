package com.RPMS.demo.service.impl;

import com.RPMS.demo.model.Skill;
import com.RPMS.demo.repository.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SkillServiceImplTest {

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private SkillServiceImpl skillService;

    private Skill skill;

    @BeforeEach
    void setUp() {
        skill = new Skill();
        skill.setSkillId(1);
        skill.setSkillName("Java");
        skill.setDescription("Java programming language");
    }

    @Test
    void testAddSkill() {
        when(skillRepository.existsBySkillName("Java")).thenReturn(false);
        when(skillRepository.save(any(Skill.class))).thenReturn(skill);

        Skill addedSkill = skillService.addSkill(skill);

        assertNotNull(addedSkill);
        assertEquals("Java", addedSkill.getSkillName());
        verify(skillRepository, times(1)).save(any(Skill.class));
    }

    @Test
    void testAddSkill_DuplicateName() {
        when(skillRepository.existsBySkillName("Java")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> skillService.addSkill(skill));
        verify(skillRepository, never()).save(any(Skill.class));
    }

    @Test
    void testGetAllSkills() {
        when(skillRepository.findAll()).thenReturn(Arrays.asList(skill));

        List<Skill> skills = skillService.getAllSkills();

        assertNotNull(skills);
        assertEquals(1, skills.size());
        assertEquals("Java", skills.get(0).getSkillName());
    }

    @Test
    void testGetSkillById() {
        when(skillRepository.findById(1)).thenReturn(Optional.of(skill));

        Skill foundSkill = skillService.getSkillById(1);

        assertNotNull(foundSkill);
        assertEquals("Java", foundSkill.getSkillName());
    }

    @Test
    void testGetSkillByIdNotFound() {
        when(skillRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> skillService.getSkillById(1));
    }

    @Test
    void testDeleteSkill() {
        doNothing().when(skillRepository).deleteById(1);

        skillService.deleteSkill(1);

        verify(skillRepository, times(1)).deleteById(1);
    }
}
