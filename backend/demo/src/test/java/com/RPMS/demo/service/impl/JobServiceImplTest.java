package com.RPMS.demo.service.impl;

import com.RPMS.demo.model.Job;
import com.RPMS.demo.model.JobSkill;
import com.RPMS.demo.model.Skill;
import com.RPMS.demo.repository.JobRepository;
import com.RPMS.demo.repository.SkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private SkillRepository skillRepository;

    @InjectMocks
    private JobServiceImpl jobService;

    private Job job;

    @BeforeEach
    void setUp() {
        job = new Job();
        job.setJobId(1);
        job.setTitle("Software Engineer");
        job.setDescription("Java & Spring Boot role");
        job.setStatus("OPEN");
        job.setMinExperienceYears(2);
    }

    @Test
    void testGetAllJobs() {
        when(jobRepository.findAll()).thenReturn(Arrays.asList(job));

        List<Job> jobs = jobService.getAllJobs();

        assertNotNull(jobs);
        assertEquals(1, jobs.size());
        assertEquals("Software Engineer", jobs.get(0).getTitle());
    }

    @Test
    void testGetJobById() {
        when(jobRepository.findById(1)).thenReturn(Optional.of(job));

        Optional<Job> foundJob = jobService.getJobById(1);

        assertTrue(foundJob.isPresent());
        assertEquals("Software Engineer", foundJob.get().getTitle());
    }

    @Test
    void testCreateJob() {
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        Job createdJob = jobService.createJob(job);

        assertNotNull(createdJob);
        assertEquals("Software Engineer", createdJob.getTitle());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void testCreateJobWithSkills() {
        Skill skill = new Skill();
        skill.setSkillId(1);
        skill.setSkillName("Java");

        JobSkill jobSkill = new JobSkill();
        jobSkill.setSkill(skill);
        jobSkill.setRequired(true);

        job.setJobSkills(new HashSet<>(Arrays.asList(jobSkill)));

        when(skillRepository.getReferenceById(1)).thenReturn(skill);
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        Job createdJob = jobService.createJob(job);

        assertNotNull(createdJob);
        verify(skillRepository, times(1)).getReferenceById(1);
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void testUpdateJob() {
        Job jobDetails = new Job();
        jobDetails.setTitle("Senior Software Engineer");
        jobDetails.setDescription("Senior Java & Spring Boot role");

        when(jobRepository.findById(1)).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        Job updatedJob = jobService.updateJob(1, jobDetails);

        assertNotNull(updatedJob);
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    void testUpdateJobNotFound() {
        Job jobDetails = new Job();
        when(jobRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobService.updateJob(1, jobDetails));
    }

    @Test
    void testDeleteJob() {
        doNothing().when(jobRepository).deleteById(1);

        jobService.deleteJob(1);

        verify(jobRepository, times(1)).deleteById(1);
    }

    @Test
    void testSearchJobs() {
        when(jobRepository.findByTitleContainingIgnoreCase("software")).thenReturn(Arrays.asList(job));

        List<Job> foundJobs = jobService.searchJobs("software");

        assertNotNull(foundJobs);
        assertEquals(1, foundJobs.size());
        assertEquals("Software Engineer", foundJobs.get(0).getTitle());
    }
}
