import React, { useEffect, useState } from "react";
import "./JobApplications.css";

const JobApplications = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const url = jobId
        ? `http://localhost:8081/api/job-applications/job/${jobId}`
        : `http://localhost:8081/api/job-applications`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch job applications");
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      console.error(err);
      alert("Error loading job applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line
  }, [jobId]);

  return (
    <div className="job-applications-page">
      <h1>
        {jobId ? `Applications for Job #${jobId}` : "Candidate Job Applications"}
      </h1>

      {loading && <div className="loading">Loading...</div>}

      {!loading && applications.length === 0 ? (
        <div className="empty">
          {jobId
            ? "No applications for this job yet"
            : "No applications found"}
        </div>
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate Name</th>
              <th>Email</th>
              <th>Job Title</th>
              <th>Gender</th>
              <th>College</th>
              <th>Degree</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Applied On</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={app.id}>
                <td>{index + 1}</td>
                <td>{app.fullName || "—"}</td>
                <td>{app.email || "—"}</td>
                <td>{app.jobTitle || (app.jobId ? `Job #${app.jobId}` : "—")}</td>
                <td>{app.gender || "—"}</td>
                <td>{app.collegeName || "—"}</td>
                <td>{app.degree || "—"}</td>
                <td>{app.experience || "—"}</td>
                <td>{app.status || "—"}</td>
                <td>
                  {app.applicationDate
                    ? new Date(app.applicationDate).toLocaleString()
                    : "—"}
                </td>
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

export default JobApplications;
