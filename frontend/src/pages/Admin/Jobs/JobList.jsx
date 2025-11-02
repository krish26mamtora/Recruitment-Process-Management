// JobList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import "./JobList.css";

const PAGE_SIZE = 8;

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [meta, setMeta] = useState({ totalPages: 0, totalElements: 0 });
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
    // eslint-disable-next-line
  }, [q, page, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:8081/api/jobs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      alert("Job deleted");
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="job-list-page">
      <div className="job-list-header">
        <h1>Jobs</h1>
        <div className="job-list-actions">
          <input
            className="job-search"
            placeholder="Search by title or id..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
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
          <button
            className="create-btn"
            onClick={() => navigate("/admin/jobs/create")}
          >
            + Create Job
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="job-grid">
        {jobs.length === 0 && !loading ? (
          <div className="empty">No jobs found</div>
        ) : (
          jobs.map((job) => (
            <div key={job.jobId} className="job-grid-item">
              <JobCard job={job} />
              <div className="job-item-actions">
                <button onClick={() => navigate(`/admin/jobs/${job.jobId}`)}>
                  View
                </button>
                <button
                  onClick={() => navigate(`/admin/jobs/edit/${job.jobId}`)}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => handleDelete(job.jobId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        <button
          disabled={page <= 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.max(1, meta.totalPages)}
        </span>
        <button
          disabled={page + 1 >= meta.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobList;
