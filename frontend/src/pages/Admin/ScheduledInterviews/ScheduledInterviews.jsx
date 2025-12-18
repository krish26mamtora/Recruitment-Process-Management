import React, { useEffect, useState } from "react";
import "./ScheduledInterviews.css";

const ScheduledInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="scheduled-interviews-page">
            <h1>Scheduled Interviews</h1>

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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ScheduledInterviews;
