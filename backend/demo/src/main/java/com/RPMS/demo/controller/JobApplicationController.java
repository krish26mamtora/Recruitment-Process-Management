package com.RPMS.demo.controller;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = "http://localhost:5173")
public class JobApplicationController {

    @Autowired
    private JobApplicationService jobApplicationService;

    // ✅ Fetch all applications
    @GetMapping
    public List<JobApplication> getAllApplications() {
        return jobApplicationService.getAllApplications();
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
