package com.RPMS.demo.service;

import com.RPMS.demo.model.Skill;

import java.util.List;

public interface SkillService {
    Skill addSkill(Skill skill);

    List<Skill> getAllSkills();

    Skill getSkillById(Integer id);

    void deleteSkill(Integer id);
}