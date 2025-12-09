import React, { useState, useEffect } from 'react';
import './JobApplicationModal.css';
import { toast } from 'react-toastify';

const JobApplicationModal = ({ candidateId, onClose }) => {
    const [jobs, setJobs] = useState([]);
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(null); // Holds the ID of the job being applied to

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch jobs
                const jobsResponse = await fetch('http://localhost:8081/api/jobs');
                if (!jobsResponse.ok) throw new Error('Failed to fetch jobs');
                const jobsData = await jobsResponse.json();

                // Fetch candidate profile
                const profileResponse = await fetch(`http://localhost:8081/api/user-profiles/${candidateId}`);
                if (!profileResponse.ok) throw new Error('Failed to fetch candidate profile');
                const profileData = await profileResponse.json();

                // Calculate scores and update jobs data
                const scoredJobs = jobsData.map(job => ({
                    ...job,
                    matchDetails: calculateMatchScore(job, profileData)
                }));

                // Sort jobs by match score descending
                scoredJobs.sort((a, b) => b.matchDetails.score - a.matchDetails.score);

                setJobs(scoredJobs);
                setCandidateProfile(profileData);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [candidateId]);

    const calculateMatchScore = (job, profile) => {
        const candidateSkills = (profile.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        const jobSkills = Array.isArray(job.skills) ? job.skills : [];
        const requiredSkills = jobSkills.filter(s => s.required).map(s => (s.skillName || '').toLowerCase()).filter(Boolean);
        const preferredSkills = jobSkills.filter(s => !s.required).map(s => (s.skillName || '').toLowerCase()).filter(Boolean);

        const matchedRequired = requiredSkills.filter(skill => candidateSkills.includes(skill));
        const missingRequired = requiredSkills.filter(skill => !candidateSkills.includes(skill));
        const matchedPreferred = preferredSkills.filter(skill => candidateSkills.includes(skill));

        let score = 0;
        score += matchedRequired.length * 2;
        score += matchedPreferred.length * 1;

        const totalExperience = profile.experiencesJson ? JSON.parse(profile.experiencesJson).reduce((acc, exp) => {
            const startDate = new Date(exp.startDate);
            const endDate = (exp.endDate || '').toLowerCase() === 'present' ? new Date() : new Date(exp.endDate);
            if (!isNaN(startDate) && !isNaN(endDate)) {
                let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
                months -= startDate.getMonth();
                months += endDate.getMonth();
                return acc + (months <= 0 ? 0 : months);
            }
            return acc;
        }, 0) / 12 : 0;

        const minExp = Number(job.minExperienceYears || 0);
        const meetsExperience = totalExperience >= minExp;
        if (meetsExperience && minExp > 0) {
            score += 5;
            const experienceBonus = Math.floor(totalExperience - minExp);
            score += Math.min(Math.max(experienceBonus, 0), 5);
        }

        return {
            score,
            candidateSkills,
            requiredSkills,
            preferredSkills,
            matchedRequired,
            missingRequired,
            matchedPreferred,
            totalExperience,
            meetsExperience,
            minExp
        };
    };

    const handleApply = async (jobId) => {
        if (window.confirm(`Apply / map this candidate to job #${jobId}?`)) {
            setApplying(jobId);
            try {
                const response = await fetch('http://localhost:8081/api/job-applications/map', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobId, candidateId }),
                });
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || 'Failed to map candidate');
                }
                toast.success('Candidate mapped to job');
            } catch (error) {
                console.error('Application error:', error);
                toast.error(error.message);
            } finally {
                setApplying(null);
            }
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Available Job Positions</h2>
                    <button onClick={onClose} className="close-modal">Close</button>
                </div>
                <div className="modal-body">
                    {loading ? (
                        <p>Loading jobs...</p>
                    ) : (
                        <div className="job-list">
                            {jobs.map((job, index) => (
                                <div key={job.jobId} className={`job-card ${index === 0 ? 'recommended' : ''}`}>
                                    <div className="job-card-header">
                                        <h3>{job.title}</h3>
                                        <span className="match-score">Match Score: {job.matchDetails.score.toFixed(2)}</span>
                                    </div>
                                    <div className="match-details">
                                        <p><strong>Experience:</strong> {job.matchDetails.totalExperience.toFixed(1)} years (Required: {job.matchDetails.minExp} years) - {job.matchDetails.meetsExperience ? <span className='met'>Met</span> : <span className='unmet'>Not Met</span>}</p>
                                        <div><strong>Required Skills ({job.matchDetails.matchedRequired.length}/{job.matchDetails.requiredSkills.length}):</strong>
                                            {job.matchDetails.requiredSkills.map(s => (
                                                <span key={s} className={`skill-tag ${job.matchDetails.matchedRequired.includes(s) ? 'met' : 'unmet'}`}>{s}</span>
                                            ))}
                                        </div>
                                        {job.matchDetails.preferredSkills.length > 0 && <div><strong>Preferred Skills ({job.matchDetails.matchedPreferred.length}/{job.matchDetails.preferredSkills.length}):</strong>
                                            {job.matchDetails.preferredSkills.map(s => (
                                                <span key={s} className={`skill-tag ${job.matchDetails.matchedPreferred.includes(s) ? 'met' : 'unmet'}`}>{s}</span>
                                            ))}
                                        </div>}
                                    </div>
                                    <div className="job-card-actions">
                                        <button
                                            className="primary"
                                            onClick={() => handleApply(job.jobId)}
                                            disabled={applying === job.jobId}
                                        >
                                            {applying === job.jobId ? 'Applying...' : 'Apply / Map Candidate'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;
