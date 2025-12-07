package com.RPMS.demo.controller;

import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.model.User;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = { "http://localhost:4173", "http://localhost:5173", "http://localhost:5174" })
public class UserProfileController {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

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
            existing.setSkills(profile.getSkills());
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

    @PostMapping("/{userId}/resume")
    public ResponseEntity<String> uploadResume(@PathVariable Long userId, @RequestParam("resume") MultipartFile file) {
        try {
            UserProfile userProfile = userProfileRepository.findById(userId).orElseGet(() -> {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "User not found, cannot create profile"));
                UserProfile newProfile = new UserProfile();
                newProfile.setUserId(user.getUserId());
                newProfile.setFullName(user.getFullName());
                newProfile.setEmail(user.getEmail());
                return newProfile;
            });

            userProfile.setResume(file.getBytes());
            userProfile.setResumeFileName(file.getOriginalFilename());
            userProfile.setResumeFileType(file.getContentType());

            userProfileRepository.save(userProfile);

            return ResponseEntity.ok("Resume uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload resume.");
        }
    }

    @GetMapping("/{userId}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long userId) {
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));

        if (userProfile.getResume() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(userProfile.getResumeFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + userProfile.getResumeFileName() + "\"")
                .body(userProfile.getResume());
    }
}
