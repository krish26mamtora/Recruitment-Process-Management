// JobCard.jsx
import React from "react";
import "./JobCard.css";

const JobCard = ({ job, applicationCount = 0 }) => {
  return (
    <div className="job-card">
      <div className="job-card-top">
        <h3 className="job-card-title">{job.title}</h3>
        <div className={`job-badge ${job.status}`}>{job.status}</div>
      </div>

      <p className="job-card-desc">
        {job.description
          ? job.description.substring(0, 140) +
            (job.description.length > 140 ? "..." : "")
          : "-"}
      </p>

      <div className="job-card-meta">
        <div>{job.minExperienceYears ?? "-"} yrs</div>
        <div>{job.assignedRecruiterName || "No recruiter"}</div>
        <div className="app-count-pill" title="Total applications">
          {applicationCount} applications
        </div>
      </div>

      <div className="job-card-skills">
        {(job.skills || []).slice(0, 4).map((s) => (
          <span key={s.skillId} className="skill-pill">
            {s.skillName}
          </span>
        ))}
      </div>
    </div>
  );
};

export default JobCard;
