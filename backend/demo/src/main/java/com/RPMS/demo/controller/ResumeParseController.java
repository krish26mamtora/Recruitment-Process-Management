package com.RPMS.demo.controller;

import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.RPMS.demo.model.User;
import com.RPMS.demo.model.UserProfile;
import com.RPMS.demo.repository.UserRepository;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.service.UserService;
import com.RPMS.demo.model.Role;
import com.RPMS.demo.repository.RoleRepository;

@RestController
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ResumeParseController {
    private static final Logger log = LoggerFactory.getLogger(ResumeParseController.class);
    private final Tika tika = new Tika();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileRepository userProfileRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/api/resume/parse")
    @Transactional
    public ResponseEntity<String> parseResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) Long userId) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
            }
            String text = tika.parseToString(file.getInputStream());
            List<String> lines = Arrays.stream(text.split("\\r?\\n"))
                    .map(l -> l.trim())
                    .filter(l -> !l.isBlank())
                    .toList();

            String name = extractName(lines);
            List<String> skills = extractSkills(text);
            List<String> education = extractEducation(lines);
            List<String> projects = extractProjects(lines);
            String experienceSummary = extractExperience(text);

            log.info("=== Resume Parsed ===");
            if (userId != null) {
                log.info("UserId: {}", userId);
            }
            log.info("Name: {}", name != null ? name : "N/A");
            log.info("Skills: {}", String.join(", ", skills));
            log.info("Education: {}", String.join(" | ", education));
            log.info("Projects: {}", String.join(" | ", projects));
            log.info("Experience: {}", experienceSummary != null ? experienceSummary : "N/A");
            log.info("Raw text length: {}", text.length());

            persistParsedData(name, skills, education, projects, experienceSummary, file);

            return ResponseEntity.ok("Parsed and printed to console");
        } catch (Exception e) {
            log.error("Failed to parse resume", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to parse resume: " + e.getMessage());
        }
    }

    private void persistParsedData(String name, List<String> skills, List<String> education, List<String> projects,
            String experienceSummary, MultipartFile file) {
        try {
            User user = null;
            if (name != null && !name.isBlank()) {
                user = userRepository.findByFullName(name).orElse(null);
            }
            if (user == null) {

                String sanitized = (name != null && !name.isBlank())
                        ? name.trim().toLowerCase().replaceAll("[^a-z0-9]+", ".")
                        : "candidate";
                String ts = String.valueOf(System.currentTimeMillis());
                String username = sanitized + "." + ts;
                String email = sanitized + "." + ts + "@example.local";
                user = userService.registerUser(username, name != null ? name : "Candidate", email, email);

                Set<String> roles = new HashSet<>();
                roles.add("ROLE_USER");
                roles.add("Candidate");
                userService.setUserRoles(user.getUserId(), roles);
            }
            UserProfile profile = userProfileRepository.findById(user.getUserId()).orElse(null);
            if (profile == null) {
                profile = new UserProfile();
                profile.setUserId(user.getUserId());
                profile.setFullName(user.getFullName());
                profile.setEmail(user.getEmail());
            }

            if (skills != null && !skills.isEmpty()) {
                profile.setSkills(String.join(", ", skills));
            }
            if (education != null && !education.isEmpty()) {
                profile.setEducationJson(objectMapper.writeValueAsString(education));
            }
            if (projects != null && !projects.isEmpty()) {
                profile.setProjectsJson(objectMapper.writeValueAsString(projects));
            }
            if (experienceSummary != null && !experienceSummary.isBlank()) {
                profile.setExperiencesJson(objectMapper.writeValueAsString(List.of(experienceSummary)));
            }

            boolean hasResume = profile.getResume() != null && profile.getResume().length > 0;
            if (!hasResume && file != null && !file.isEmpty()) {
                profile.setResume(file.getBytes());
                profile.setResumeFileName(file.getOriginalFilename());
                profile.setResumeFileType(file.getContentType());
            }

            userProfileRepository.save(profile);
        } catch (Exception e) {
            log.error("Failed to persist parsed data to user/user_profile/user_roles", e);
        }
    }

    private String extractName(List<String> lines) {

        for (String l : lines) {
            String s = l.trim();
            if (s.length() >= 2 && s.length() <= 60
                    && !s.toLowerCase().matches("^(resume|curriculum vitae|cv)\\b.*")
                    && !s.matches(".*[@|\\{\\}\\[\\];].*")
                    && Character.isLetter(s.charAt(0))
                    && s.split("\\s+").length <= 5) {
                return s;
            }
        }
        return null;
    }

    private List<String> extractSkills(String text) {

        Pattern p = Pattern.compile("(?is)\\bskills\\b[:\\n\\r\\-]*([^\\n]+(?:\\n(?!\\w+:).*)*)");
        Matcher m = p.matcher(text);
        Set<String> out = new LinkedHashSet<>();
        if (m.find()) {
            String block = m.group(1);
            for (String token : block.split("[,\\n]")) {
                String t = token.trim();
                if (t.length() >= 2 && t.length() <= 40) {
                    out.add(t);
                }
            }
        }

        String[] common = { "Java", "Python", "C++", "JavaScript", "React", "Angular", "Node", "Spring", "Django",
                "SQL", "PostgreSQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Git", "HTML", "CSS", "TypeScript" };
        String lower = text.toLowerCase();
        for (String c : common) {
            if (lower.contains(c.toLowerCase()))
                out.add(c);
        }
        return new ArrayList<>(out);
    }

    private List<String> extractEducation(List<String> lines) {
        List<String> ed = new ArrayList<>();
        Pattern degree = Pattern
                .compile("(?i)\\b(B\\.? ?Tech|M\\.? ?Tech|B\\.? ?E\\.?|M\\.? ?E\\.?|BSc|MSc|MBA|PhD)\\b");
        for (String l : lines) {
            if (degree.matcher(l).find() || l.toLowerCase().contains("university")
                    || l.toLowerCase().contains("college")) {
                ed.add(l);
            }
        }

        if (ed.size() > 6)
            return ed.subList(0, 6);
        return ed;
    }

    private List<String> extractProjects(List<String> lines) {
        List<String> pr = new ArrayList<>();
        boolean inProjects = false;
        for (String l : lines) {
            String t = l.toLowerCase();
            if (t.startsWith("projects") || t.startsWith("project")) {
                inProjects = true;
                continue;
            }
            if (inProjects) {
                if (t.matches("^\\w+\\s*:.*"))
                    break;
                pr.add(l);
                if (pr.size() >= 6)
                    break;
            }
        }
        return pr;
    }

    private String extractExperience(String text) {
        Pattern years = Pattern.compile("(?i)(\\d+(?:\\.\\d+)?)\\s*(?:\\+\\s*)?(years?|yrs?)\\s+of\\s+experience");
        Matcher m = years.matcher(text);
        if (m.find()) {
            return m.group(0);
        }
        Pattern section = Pattern.compile("(?is)\\bexperience\\b[:\\n\\r\\-]*(.{0,800})");
        Matcher m2 = section.matcher(text);
        if (m2.find()) {
            return m2.group(0).replaceAll("\\s+", " ").trim();
        }
        return null;
    }
}
