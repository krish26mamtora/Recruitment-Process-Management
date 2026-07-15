import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "./JobCard";
import "./JobList.css";

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [appCounts, setAppCounts] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + `/jobs`);
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data || []);

      const appsRes = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/job-applications`,
      );
      if (appsRes.ok) {
        const apps = await appsRes.json();
        const counts = {};
        (apps || []).forEach((app) => {
          const jid = app?.job?.jobId;
          if (!jid) return;
          counts[jid] = (counts[jid] || 0) + 1;
        });
        setAppCounts(counts);
      } else {
        console.warn("Failed to fetch job applications for counts");
      }
    } catch (err) {
      console.error(err);
      alert("Error loading jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job? This action cannot be undone.")) return;
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/jobs/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");

      alert("Job deleted");
      load();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
  const filteredJobs = jobs.filter((job) => {
    const search = q.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(search) ||
      String(job.jobId)?.includes(search);

    const matchesStatus = !statusFilter || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page job-list-page">
      <div className="page-inner">
        <div
          className="page-actions job-list-actions"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            background: "var(--surface)",
            padding: "14px 16px",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <input
            placeholder="Search by title or id..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              flex: "1 1 auto",
              minWidth: "200px",
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              outline: "none",
            }}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              flex: "0 0 160px",
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
            }}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="on_hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={() => navigate("/admin/jobs/create")}
            style={{
              flex: "0 0 auto",
              whiteSpace: "nowrap",
              padding: "10px 18px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            + Create Job
          </button>
        </div>

        {loading && <div className="loading">Loading...</div>}

        <div className="job-grid">
          {filteredJobs.length === 0 && !loading ? (
            <div className="empty">No jobs found</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.jobId} className="job-grid-item">
                {/* Pass application count to the card */}
                <JobCard
                  job={job}
                  applicationCount={appCounts[job.jobId] || 0}
                />
                <div className="job-item-actions">
                  <button
                    className="secondary btn-sm"
                    onClick={() => navigate(`/admin/jobs/${job.jobId}`)}
                  >
                    View
                  </button>
                  <button
                    className="secondary btn-sm"
                    onClick={() => navigate(`/admin/jobs/edit/${job.jobId}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="danger btn-sm"
                    style={{ backgroundColor: "var(--danger)", color: "white" }}
                    onClick={() => handleDelete(job.jobId)}
                  >
                    Delete
                  </button>
                  {/* New per-job applications button */}
                  <button
                    className="primary btn-sm applications-btn"
                    onClick={() =>
                      navigate(`/admin/jobs/${job.jobId}/applications`)
                    }
                  >
                    Applications
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
