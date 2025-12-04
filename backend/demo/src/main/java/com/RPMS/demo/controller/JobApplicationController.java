package com.RPMS.demo.controller;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class JobApplicationController {
    private static final Logger log = LoggerFactory.getLogger(JobApplicationController.class);

    @Autowired
    private JobApplicationService jobApplicationService;

    // ✅ Lightweight DTO to avoid serialization issues
    public static class JobApplicationDTO {
        public Integer id;
        public Integer jobId;
        public String jobTitle;
        public Long candidateId;
        public String fullName;
        public String email;
        public String phone;
        public String gender;
        public Integer age;
        public String address;
        public String collegeName;
        public String degree;
        public String branch;
        public Double cpi;
        public String experience;
        public String whyJoin;
        public String fileName;
        public String contentType;
        public Instant applicationDate;
        public String status;
        public String remarks;

        public static JobApplicationDTO from(JobApplication app) {
            JobApplicationDTO dto = new JobApplicationDTO();
            dto.id = app.getId();
            dto.jobId = app.getJobIdFk();
            dto.candidateId = app.getCandidateIdFk();
            dto.fullName = app.getFullName();
            dto.email = app.getEmail();
            dto.phone = app.getPhone();
            dto.gender = app.getGender();
            dto.age = app.getAge();
            dto.address = app.getAddress();
            dto.collegeName = app.getCollegeName();
            dto.degree = app.getDegree();
            dto.branch = app.getBranch();
            dto.cpi = app.getCpi();
            dto.experience = app.getExperience();
            dto.whyJoin = app.getWhyJoin();
            dto.fileName = app.getFileName();
            dto.contentType = app.getContentType();
            dto.applicationDate = app.getApplicationDate();
            dto.status = app.getStatus();
            dto.remarks = app.getRemarks();
            return dto;
        }

    }

    // ✅ Fetch all applications
    @GetMapping
    public List<JobApplicationDTO> getAllApplications() {
        try {
            return jobApplicationService.getAllApplications()
                    .stream().map(JobApplicationDTO::from).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch all applications", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch applications");
        }
    }

    // ✅ Fetch applications by job ID
    @GetMapping("/job/{jobId}")
    public List<JobApplicationDTO> getApplicationsByJob(@PathVariable Integer jobId) {
        try {
            return jobApplicationService.getApplicationsByJobId(jobId)
                    .stream().map(JobApplicationDTO::from).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch applications for job {}", jobId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch job applications");
        }
    }

    // ✅ Fetch applications by candidate ID
    @GetMapping("/candidate/{candidateId}")
    public List<JobApplicationDTO> getApplicationsByCandidate(@PathVariable Long candidateId) {
        try {
            return jobApplicationService.getApplicationsByCandidateId(candidateId)
                    .stream().map(JobApplicationDTO::from).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to fetch applications for candidate {}", candidateId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to fetch candidate applications");
        }
    }

    // ✅ Apply for job
    @PostMapping("/apply")
    public JobApplication applyForJob(
            @RequestParam("jobId") Integer jobId,
            @RequestParam("candidateId") Long candidateId,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "age", required = false) Integer age,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "collegeName", required = false) String collegeName,
            @RequestParam(value = "degree", required = false) String degree,
            @RequestParam(value = "branch", required = false) String branch,
            @RequestParam(value = "cpi", required = false) Double cpi,
            @RequestParam(value = "experience", required = false) String experience,
            @RequestParam(value = "whyJoin", required = false) String whyJoin,
            @RequestParam("resume") MultipartFile resumeFile) throws Exception {

        return jobApplicationService.applyForJob(
                jobId, candidateId, fullName, email, phone,
                gender, age, address, collegeName, degree, branch,
                cpi, experience, whyJoin, resumeFile);
    }

    // ✅ Download resume by application ID
    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        JobApplication app = jobApplicationService.getApplicationById(id);
        if (app == null || app.getResumeData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + app.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(app.getContentType()))
                .body(app.getResumeData());
    }
}
