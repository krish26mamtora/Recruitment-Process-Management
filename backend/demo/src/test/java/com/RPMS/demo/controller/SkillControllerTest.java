package com.RPMS.demo.controller;

import com.RPMS.demo.model.Skill;
import com.RPMS.demo.service.SkillService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SkillController.class)
@AutoConfigureMockMvc(addFilters = false)
public class SkillControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SkillService skillService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private Skill sampleSkill;

    @BeforeEach
    void setUp() {
        sampleSkill = new Skill();
        sampleSkill.setSkillId(1);
        sampleSkill.setSkillName("Java");
    }

    @Test
    void testGetAllSkills() throws Exception {
        Mockito.when(skillService.getAllSkills()).thenReturn(Arrays.asList(sampleSkill));

        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].skillId").value(1))
                .andExpect(jsonPath("$[0].skillName").value("Java"));
   }

    @Test
    void testAddSkill() throws Exception {
        Mockito.when(skillService.addSkill(any(Skill.class))).thenReturn(sampleSkill);

        mockMvc.perform(post("/api/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleSkill)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skillId").value(1))
                .andExpect(jsonPath("$.skillName").value("Java"));
    }

    @Test
    void testGetSkillById() throws Exception {
        Mockito.when(skillService.getSkillById(1)).thenReturn(sampleSkill);

        mockMvc.perform(get("/api/skills/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skillId").value(1))
                .andExpect(jsonPath("$.skillName").value("Java"));
    }

    @Test
    void testDeleteSkill() throws Exception {
        Mockito.doNothing().when(skillService).deleteSkill(1);

        mockMvc.perform(delete("/api/skills/1"))
                .andExpect(status().isOk());
    }
}
