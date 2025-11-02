package com.RPMS.demo.service.impl;

import com.RPMS.demo.model.Skill;
import com.RPMS.demo.repository.SkillRepository;
import com.RPMS.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public Skill addSkill(Skill skill) {
        if (skillRepository.existsBySkillName(skill.getSkillName())) {
            throw new RuntimeException("Skill with this name already exists!");
        }
        return skillRepository.save(skill);
    }

    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public Skill getSkillById(Integer id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found with id: " + id));
    }

    @Override
    public void deleteSkill(Integer id) {
        skillRepository.deleteById(id);
    }
}
