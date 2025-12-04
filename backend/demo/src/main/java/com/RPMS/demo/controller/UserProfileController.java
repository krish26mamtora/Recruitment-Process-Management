package com.RPMS.demo.controller;

import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = {"http://localhost:4173", "http://localhost:5173", "http://localhost:5174"})
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @GetMapping("/{userId}")
    public UserProfile getUserProfile(@PathVariable Long userId) {
        return userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));
    }

    @PostMapping
    public UserProfile upsertUserProfile(@RequestBody UserProfile profile) {
        if (profile.getUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }

        UserProfile existing = userProfileRepository.findById(profile.getUserId()).orElse(null);
        if (existing != null) {
            existing.setFullName(profile.getFullName());
            existing.setEmail(profile.getEmail());
            existing.setPhone(profile.getPhone());
            existing.setCity(profile.getCity());
            existing.setProfilePhotoUrl(profile.getProfilePhotoUrl());
            existing.setCurrentJobTitle(profile.getCurrentJobTitle());
            existing.setSummary(profile.getSummary());
            existing.setSkillsLanguages(profile.getSkillsLanguages());
            existing.setSkillsFrameworks(profile.getSkillsFrameworks());
            existing.setSkillsTools(profile.getSkillsTools());
            existing.setSkillsCloud(profile.getSkillsCloud());
            existing.setSkillsDatabases(profile.getSkillsDatabases());
            existing.setSkillsOther(profile.getSkillsOther());
            existing.setExperiencesJson(profile.getExperiencesJson());
            existing.setEducationJson(profile.getEducationJson());
            existing.setCertificationsJson(profile.getCertificationsJson());
            existing.setProjectsJson(profile.getProjectsJson());
            existing.setAttachmentsJson(profile.getAttachmentsJson());
            existing.setLinkedin(profile.getLinkedin());
            existing.setGithub(profile.getGithub());
            existing.setPortfolio(profile.getPortfolio());
            existing.setExpectedSalary(profile.getExpectedSalary());
            existing.setNoticePeriod(profile.getNoticePeriod());
            existing.setPreferredJobLocation(profile.getPreferredJobLocation());
            existing.setJobTypePreference(profile.getJobTypePreference());
            return userProfileRepository.save(existing);
        }

        return userProfileRepository.save(profile);
    }
}
