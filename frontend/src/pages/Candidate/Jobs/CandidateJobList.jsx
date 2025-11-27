import React, { useEffect, useState } from "react";
import "./CandidateJobList.css";

const CandidateJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
      alert("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [q, statusFilter]);

  // ✅ When Apply button clicked, open a new tab with job application form
  const handleApply = (jobId) => {
    if (!window.confirm("Do you want to apply for this job?")) return;
    window.open(`/candidate/jobs/apply/${jobId}`, "_blank");
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(q.toLowerCase()) ||
      job.jobId.toString().includes(q);
    const matchesStatus = statusFilter
      ? job.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="candidate-job-list-page">
      <div className="candidate-job-header">
        <h1>Available Jobs</h1>
        <div className="candidate-job-actions">
          <input
            className="job-search"
            placeholder="Search by title or ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="on_hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading jobs...</div>}

      <div className="candidate-job-grid">
        {filteredJobs.length === 0 && !loading ? (
          <div className="empty">No jobs found</div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.jobId} className="candidate-job-card">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-field">
                <strong>Job ID:</strong> {job.jobId}
              </p>
              <p className="job-field">
                <strong>Status:</strong> {job.status}
              </p>
              <p className="job-field">
                <strong>Location:</strong> {job.location || "N/A"}
              </p>
              <p className="job-field">
                <strong>Experience:</strong> {job.experience || "Not specified"}
              </p>
              <p className="job-field">
                <strong>Skills Required:</strong>{" "}
                {job.skills && job.skills.length > 0
                  ? job.skills.map((s) => s.skillName).join(", ")
                  : "N/A"}
              </p>
              <p className="job-field">
                <strong>Description:</strong>{" "}
                {job.description || "No description available"}
              </p>

              <div className="candidate-job-actions-btn">
                {job.status === "open" ? (
                  <button
                    className="apply-btn"
                    onClick={() => handleApply(job.jobId)}
                  >
                    Apply Now
                  </button>
                ) : (
                  <button className="closed-btn" disabled>
                    Closed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateJobList;
