package com.RPMS.demo.service;

import com.RPMS.demo.model.JobApplication;
import com.RPMS.demo.repository.JobApplicationRepository;
import com.RPMS.demo.repository.JobRepository;
import com.RPMS.demo.repository.UserRepository;
import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class JobApplicationService {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

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

        return jobApplicationRepository.save(application);
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
}
