// JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closingReason, setClosingReason] = useState("");

  // Fetch job from backend API
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8081/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Job not found");
        return res.json();
      })
      .then((data) => setJob(data))
      .catch(() => {
        alert("Job not found");
        navigate("/admin/jobs");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !job)
    return (
      <div className="page job-details-page">
        <div className="page-inner">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );

  // Update job status to closed
  const handleClose = async () => {
    if (!closingReason.trim()) {
      alert("Please provide reason to close the job");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "closed",
          reasonClosed: closingReason,
          closedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to close job");
      const updated = await res.json();
      setJob(updated);
      alert("Job closed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to close job");
    }
  };

  return (
    <div className="page job-details-page">
      <div className="page-inner">
        <div className="job-details-card">
          <header className="job-header">
            <div>
              <h1>{job.title}</h1>
              <div className="meta">
                <span className={`badge ${job.status}`}>{job.status}</span>
                <span>• ID: {job.jobId}</span>
                <span>
                  • Created: {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="header-actions">
              <button className="secondary btn-sm" onClick={() => navigate(`/admin/jobs/edit/${job.jobId}`)}>
                Edit
              </button>
              <button className="secondary btn-sm" onClick={() => navigate("/admin/jobs")}>Back</button>
            </div>
          </header>

          <section className="job-section">
            <h3>Description</h3>
            <p className="desc">{job.description || "—"}</p>
          </section>

          <section className="job-section">
            <h3>Details</h3>
            <div className="details-grid">
              <div>
                <strong>Min Experience</strong>
                <div>{job.minExperienceYears ?? "-"} years</div>
              </div>
              <div>
                <strong>Assigned Recruiter</strong>
                <div>{job.assignedRecruiterName || "-"}</div>
              </div>
              <div>
                <strong>Pipeline</strong>
                <div>Applied: {job.pipelineCounts?.applied ?? 0}</div>
                <div>Shortlisted: {job.pipelineCounts?.shortlisted ?? 0}</div>
              </div>
            </div>
          </section>

          <section className="job-section">
            <h3>Skills</h3>
            <div className="skills-list">
              {(job.skills || []).map((s) => (
                <span key={s.skillId} className="skill-pill">
                  {s.skillName}
                  {s.required ? " • req" : ""}
                </span>
              ))}
              {(!job.skills || job.skills.length === 0) && (
                <div className="muted">No skills attached</div>
              )}
            </div>
          </section>

          {job.status !== "closed" && (
            <section className="job-section close-box">
              <h3>Close Job</h3>
              <textarea
                placeholder="Reason for closing"
                value={closingReason}
                onChange={(e) => setClosingReason(e.target.value)}
              />
              <div className="actions-row">
                <button className="danger" onClick={handleClose}>
                  Close Job
                </button>
              </div>
            </section>
          )}

          {job.status === "closed" && (
            <section className="job-section">
              <h3>Closed Info</h3>
              <div>
                <strong>Reason:</strong> {job.reasonClosed || "-"}
              </div>
              <div>
                <strong>Closed at:</strong>{" "}
                {job.closedAt ? new Date(job.closedAt).toLocaleString() : "-"}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
