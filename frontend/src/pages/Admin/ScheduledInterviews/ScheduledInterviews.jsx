import React, { useEffect, useState } from "react";
import "./ScheduledInterviews.css";

const ScheduledInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({
        interviewerName: "",
        comments: "",
        ratings: { "Communication": 3, "Technical Skills": 3 },
        newSkill: "",
        newRating: 0
    });

    const loadInterviews = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8081/api/job-applications/scheduled-interviews");
            if (!res.ok) throw new Error("Failed to fetch interviews");
            const data = await res.json();
            setInterviews(data || []);
        } catch (err) {
            console.error(err);
            alert("Error loading scheduled interviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return "—";
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString();
        } catch {
            return dateTimeStr;
        }
    };

    const handleOpenFeedback = (interview) => {
        setSelectedInterview(interview);
        setFeedbackForm({
            interviewerName: "",
            comments: "",
            ratings: { "Communication": 3, "Technical Skills": 3 },
            newSkill: "",
            newRating: 0
        });
        setShowFeedbackModal(true);
    };

    const handleSubmitFeedback = async () => {
        if (!selectedInterview) return;
        const ratingsJson = JSON.stringify(feedbackForm.ratings);
        const payload = {
            round: selectedInterview.round,
            interviewerName: feedbackForm.interviewerName,
            comments: feedbackForm.comments,
            ratingsJson: ratingsJson
        };

        try {
            const res = await fetch(`http://localhost:8081/api/job-applications/${selectedInterview.applicationId}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to submit feedback");
            alert("Feedback submitted successfully");
            setShowFeedbackModal(false);
        } catch (err) {
            console.error(err);
            alert("Error submitting feedback");
        }
    };

    const handleRatingChange = (skill, rating) => {
        setFeedbackForm(prev => ({
            ...prev,
            ratings: { ...prev.ratings, [skill]: parseInt(rating) }
        }));
    };

    const handleAddSkill = () => {
        if (feedbackForm.newSkill && feedbackForm.newRating > 0) {
            setFeedbackForm(prev => ({
                ...prev,
                ratings: { ...prev.ratings, [prev.newSkill]: parseInt(prev.newRating) },
                newSkill: "",
                newRating: 0
            }));
        }
    };

    return (
        <div className="page scheduled-interviews-page">
            <div className="page-inner">
                <div className="page-header">
                    <h1 className="page-title">Scheduled Interviews</h1>
                </div>

                {loading && <div className="loading">Loading interviews...</div>}

                {!loading && interviews.length === 0 ? (
                    <div className="empty">No interviews scheduled yet</div>
                ) : (
                    <div className="interviews-grid">
                        {interviews.map((interview) => (
                            <div key={interview.applicationId} className="interview-card">
                                <div className="interview-header">
                                    <h3>{interview.jobTitle}</h3>
                                    <span className="round-badge">{interview.round}</span>
                                </div>

                                <div className="interview-details">
                                    <div className="detail-row">
                                        <strong>Candidate:</strong>
                                        <span>{interview.candidateName}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Email:</strong>
                                        <span>{interview.candidateEmail}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Scheduled At:</strong>
                                        <span>{formatDateTime(interview.scheduledAt)}</span>
                                    </div>
                                    <div className="detail-row">
                                        <strong>Meet Link:</strong>
                                        <a
                                            href={interview.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="meet-link"
                                        >
                                            Join Meeting
                                        </a>
                                    </div>
                                    {interview.message && (
                                        <div className="detail-row">
                                            <strong>Notes:</strong>
                                            <span>{interview.message}</span>
                                        </div>
                                    )}
                                    {interview.interviewerEmails && interview.interviewerEmails.length > 0 && (
                                        <div className="detail-row">
                                            <strong>Panel Interviewers:</strong>
                                            <div className="interviewer-list">
                                                {interview.interviewerEmails.map((email, idx) => (
                                                    <span key={idx} className="interviewer-chip">
                                                        {email}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="detail-row">
                                        <strong>Status:</strong>
                                        <span className="status-badge">{interview.status}</span>
                                    </div>
                                    <button 
                                        className="feedback-btn"
                                        onClick={() => handleOpenFeedback(interview)}
                                    >
                                        Add Feedback
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showFeedbackModal && (
                    <div className="modal-backdrop">
                        <div className="modal-content feedback-modal">
                            <h2>Add Interview Feedback</h2>
                            <p><strong>Candidate:</strong> {selectedInterview?.candidateName}</p>
                            <p><strong>Round:</strong> {selectedInterview?.round}</p>
                            
                            <div className="form-group">
                                <label>Interviewer Name</label>
                                <input 
                                    type="text" 
                                    value={feedbackForm.interviewerName}
                                    onChange={(e) => setFeedbackForm({...feedbackForm, interviewerName: e.target.value})}
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="ratings-section">
                                <h3>Tech Ratings (1-5)</h3>
                                <div className="ratings-list">
                                    {Object.entries(feedbackForm.ratings).map(([skill, rating]) => (
                                        <div key={skill} className="rating-item">
                                            <label>{skill}</label>
                                            <input 
                                                type="range" 
                                                min="1" max="5" 
                                                value={rating}
                                                onChange={(e) => handleRatingChange(skill, e.target.value)}
                                            />
                                            <span>{rating}/5</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="add-skill-row">
                                    <input 
                                        type="text" 
                                        placeholder="New Skill (e.g. Java)"
                                        value={feedbackForm.newSkill}
                                        onChange={(e) => setFeedbackForm({...feedbackForm, newSkill: e.target.value})}
                                    />
                                    <input 
                                        type="number" 
                                        min="1" max="5" 
                                        placeholder="Rating"
                                        value={feedbackForm.newRating}
                                        onChange={(e) => setFeedbackForm({...feedbackForm, newRating: e.target.value})}
                                    />
                                    <button type="button" onClick={handleAddSkill}>Add</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Detailed Comments</label>
                                <textarea 
                                    rows="4"
                                    value={feedbackForm.comments}
                                    onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})}
                                    placeholder="Enter detailed evaluation..."
                                />
                            </div>

                            <div className="modal-actions">
                                <button onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                                <button className="primary" onClick={handleSubmitFeedback}>Submit Feedback</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduledInterviews;
