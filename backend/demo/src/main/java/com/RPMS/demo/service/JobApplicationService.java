package com.RPMS.demo.service;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.repository.JobApplicationRepository;
import com.RPMS.demo.repository.JobRepository;
import com.RPMS.demo.repository.UserRepository;
import com.RPMS.demo.repository.UserProfileRepository;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.User;
import com.RPMS.demo.model.UserProfile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.time.Instant;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    // ✅ Apply for a Job
    public JobApplication applyForJob(Integer jobId, Long candidateId,
            String fullName, String email, String phone, String gender,
            Integer age, String address, String collegeName, String degree,
            String branch, Double cpi, String experience, String whyJoin,
            MultipartFile resumeFile) throws Exception {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setFullName(fullName);
        application.setEmail(email);
        application.setPhone(phone);
        application.setGender(gender);
        application.setAge(age);
        application.setAddress(address);
        application.setCollegeName(collegeName);
        application.setDegree(degree);
        application.setBranch(branch);
        application.setCpi(cpi);
        application.setExperience(experience);
        application.setWhyJoin(whyJoin);

        application.setFileName(resumeFile.getOriginalFilename());
        application.setContentType(resumeFile.getContentType());
        application.setResumeData(resumeFile.getBytes());

        JobApplication saved = jobApplicationRepository.save(application);
        eventPublisher.publishEvent(new com.RPMS.demo.event.CandidateJobAssignmentEvent(
                candidate.getEmail(),
                application.getFullName(),
                job.getTitle(),
                true));
        return saved;
    }

    // ✅ Fetch All Job Applications
    @Transactional(readOnly = true)
    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    // ✅ Fetch job applications by Job ID
    @Transactional(readOnly = true)
    public List<JobApplication> getApplicationsByJobId(Integer jobId) {
        return jobApplicationRepository.findByJobIdFk(jobId);
    }

    // ✅ Fetch applications by Candidate ID
    @Transactional(readOnly = true)
    public List<JobApplication> getApplicationsByCandidateId(Long candidateId) {
        return jobApplicationRepository.findByCandidate_UserId(candidateId);
    }

    // ✅ Fetch by ID (use Integer type)
    public JobApplication getApplicationById(Long id) {
        return jobApplicationRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    @Transactional
    public JobApplication mapCandidateToJob(Integer jobId, Long candidateId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        UserProfile profile = userProfileRepository.findById(candidateId).orElse(null);

        JobApplication app = new JobApplication();
        app.setJob(job);
        app.setCandidate(candidate);
        if (profile != null) {
            app.setFullName(profile.getFullName());
            app.setEmail(profile.getEmail());
            app.setPhone(profile.getPhone() != null ? profile.getPhone() : "");
            if (profile.getResume() != null && profile.getResume().length > 0) {
                app.setResumeData(profile.getResume());
                app.setFileName(profile.getResumeFileName());
                app.setContentType(profile.getResumeFileType());
            }
        } else {
            app.setFullName(candidate.getFullName());
            app.setEmail(candidate.getEmail());
            app.setPhone("");
        }
        app.setStatus("Applied");
        // ensure legacy NOT NULL DB constraints are satisfied
        if (app.getResumeData() == null)
            app.setResumeData(new byte[0]);
        if (app.getFileName() == null)
            app.setFileName("N/A");
        if (app.getContentType() == null)
            app.setContentType("application/octet-stream");
        JobApplication saved = jobApplicationRepository.save(app);
        eventPublisher.publishEvent(new com.RPMS.demo.event.CandidateJobAssignmentEvent(
                candidate.getEmail(),
                app.getFullName(),
                job.getTitle(),
                false));
        return saved;
    }

    @Transactional
    public JobApplication scheduleInterview(Long applicationId, String round, String scheduledAtIso, String meetLink,
            String message) {
        JobApplication app = getApplicationById(applicationId);
        Job job = app.getJob();
        User candidate = app.getCandidate();
        String r = (round != null && !round.isBlank()) ? round : "Technical";
        Instant when = null;
        try {
            when = Instant.parse(scheduledAtIso);
        } catch (Exception ignored) {
        }
        String whenText = scheduledAtIso != null ? scheduledAtIso : "TBD";
        String link = (meetLink != null && !meetLink.isBlank()) ? meetLink : "https://meet.google.com/dummy-link";
        app.setStatus("Interview - " + r + " scheduled");
        String details = "Round: " + r + ", When: " + whenText + ", Meet: " + link
                + (message != null && !message.isBlank() ? (", Notes: " + message) : "");
        app.setRemarks(details);
        JobApplication saved = jobApplicationRepository.save(app);
        eventPublisher.publishEvent(new com.RPMS.demo.event.InterviewScheduledEvent(
                candidate.getEmail(),
                app.getFullName(),
                job.getTitle(),
                r,
                whenText,
                link,
                message));
        return saved;
    }

    @Transactional
    public JobApplication updateApplicationStatus(Long applicationId, String status, String remarks) {
        JobApplication app = getApplicationById(applicationId);
        Job job = app.getJob();
        User candidate = app.getCandidate();
        if (status != null && !status.isBlank()) {
            app.setStatus(status);
        }
        if (remarks != null) {
            app.setRemarks(remarks);
        }
        JobApplication saved = jobApplicationRepository.save(app);
        eventPublisher.publishEvent(new com.RPMS.demo.event.ApplicationStatusUpdatedEvent(
                candidate.getEmail(),
                app.getFullName(),
                job.getTitle(),
                app.getStatus(),
                app.getRemarks()));
        return saved;
    }
}
