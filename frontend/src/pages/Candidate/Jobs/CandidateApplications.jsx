import React, { useEffect, useState } from "react";
import "./CandidateJobList.css";

const CandidateApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {
    const uidStr = String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (!Number.isFinite(uid) || uid <= 0) {
      alert("No valid user found. Please login again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8081/api/job-applications/candidate/${uid}`);
      if (!res.ok) throw new Error("Failed to fetch your applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error loading your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadApplications(); }, []);

  return (
    <div className="candidate-job-list-page">
      <div className="candidate-job-header">
        <h1>Your Applications</h1>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {!loading && applications.length === 0 ? (
        <div className="empty">You haven’t applied to any jobs yet</div>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Job</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr key={app.id}>
                <td>{idx + 1}</td>
                <td>{app.jobTitle || `Job #${app.jobId}`}</td>
                <td>{app.status || "—"}</td>
                <td>{app.applicationDate ? new Date(app.applicationDate).toLocaleString() : "—"}</td>
                <td>
                  {app.fileName ? (
                    <a
                      href={`http://localhost:8081/api/job-applications/${app.id}/resume`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-link"
                    >
                      View Resume
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CandidateApplications;
