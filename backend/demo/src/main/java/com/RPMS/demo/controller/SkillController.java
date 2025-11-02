package com.RPMS.demo.controller;

import com.RPMS.demo.model.Skill;
import com.RPMS.demo.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access (React, etc.)
public class SkillController {

    @Autowired
    private SkillService skillService;

    // ✅ GET: fetch all skills (mapped to /all)
    @GetMapping("/all")
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    // ✅ POST: add a new skill
    @PostMapping
    public Skill addSkill(@RequestBody Skill skill) {
        return skillService.addSkill(skill);
    }

    // ✅ GET: fetch skill by ID
    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Integer id) {
        return skillService.getSkillById(id);
    }

    // ✅ DELETE: delete skill by ID
    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Integer id) {
        skillService.deleteSkill(id);
    }
}
