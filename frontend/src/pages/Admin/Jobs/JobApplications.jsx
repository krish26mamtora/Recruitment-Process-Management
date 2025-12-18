import React, { useEffect, useState } from "react";
import "./JobApplications.css";

const JobApplications = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [round, setRound] = useState("Technical");
  const [customRound, setCustomRound] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [meetLink, setMeetLink] = useState("https://meet.google.com/dummy-link");
  const [message, setMessage] = useState("");
  const [interviewerEmails, setInterviewerEmails] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newRemarks, setNewRemarks] = useState("");

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
              <th>Actions</th>
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
                <td>
                  <button
                    className="primary"
                    onClick={() => {
                      setSelectedApp(app);
                      setShowScheduleModal(true);
                    }}
                  >
                    Arrange Interview
                  </button>
                  <button
                    className="secondary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setSelectedApp(app);
                      setNewStatus(app.status || "");
                      setNewRemarks("");
                      setShowStatusModal(true);
                    }}
                  >
                    Update Stage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showScheduleModal && selectedApp && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2>Schedule Interview</h2>
              <button className="close-modal" onClick={() => setShowScheduleModal(false)}>Close</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>Round</label>
                <select value={round} onChange={(e) => setRound(e.target.value)}>
                  <option value="Technical">Technical</option>
                  <option value="HR">HR</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              {round === "Custom" && (
                <div className="form-row">
                  <label>Custom Round Name</label>
                  <input value={customRound} onChange={(e) => setCustomRound(e.target.value)} placeholder="e.g., Managerial" />
                </div>
              )}
              <div className="form-row">
                <label>Date & Time</label>
                <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Meet Link</label>
                <input value={meetLink} onChange={(e) => setMeetLink(e.target.value)} />
              </div>
              <div className="form-row">
                <label>Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Any additional instructions" />
              </div>
              <div className="form-row">
                <label>Panel Interviewers (Optional)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    placeholder="interviewer@example.com"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentEmail && currentEmail.includes('@')) {
                          setInterviewerEmails([...interviewerEmails, currentEmail]);
                          setCurrentEmail('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      if (currentEmail && currentEmail.includes('@')) {
                        setInterviewerEmails([...interviewerEmails, currentEmail]);
                        setCurrentEmail('');
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
                {interviewerEmails.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {interviewerEmails.map((email, idx) => (
                      <span key={idx} style={{
                        background: '#e3f2fd',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        {email}
                        <button
                          type="button"
                          onClick={() => setInterviewerEmails(interviewerEmails.filter((_, i) => i !== idx))}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#d32f2f',
                            fontSize: '16px',
                            padding: '0',
                            lineHeight: '1'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="primary"
                onClick={async () => {
                  if (!scheduledAt) { alert("Please select date & time"); return; }
                  const r = round === "Custom" ? (customRound || "Custom") : round;
                  const payload = {
                    round: r,
                    scheduledAt,
                    meetLink,
                    message,
                    interviewerEmails,
                  };
                  try {
                    const res = await fetch(`http://localhost:8081/api/job-applications/${selectedApp.id}/schedule-interview`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    if (!res.ok) { const t = await res.text(); throw new Error(t || 'Failed to schedule'); }
                    setShowScheduleModal(false);
                    setSelectedApp(null);
                    setRound('Technical');
                    setCustomRound('');
                    setScheduledAt('');
                    setMeetLink('https://meet.google.com/dummy-link');
                    setMessage('');
                    setInterviewerEmails([]);
                    setCurrentEmail('');
                    await loadApplications();
                    alert('Interview scheduled and candidate notified.');
                  } catch (e) {
                    console.error(e);
                    alert('Could not schedule interview');
                  }
                }}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {showStatusModal && selectedApp && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2>Update Stage</h2>
              <button className="close-modal" onClick={() => setShowStatusModal(false)}>Close</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <label>Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Applied">Applied</option>
                  <option value="Interview - Technical scheduled">Interview - Technical scheduled</option>
                  <option value="Interview - HR scheduled">Interview - HR scheduled</option>
                  <option value="Selected - next round">Selected - next round</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="form-row">
                <label>Remarks</label>
                <textarea value={newRemarks} onChange={(e) => setNewRemarks(e.target.value)} placeholder="Notes for candidate" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="primary"
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:8081/api/job-applications/${selectedApp.id}/status`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: newStatus, remarks: newRemarks })
                    });
                    if (!res.ok) { const t = await res.text(); throw new Error(t || 'Failed to update'); }
                    setShowStatusModal(false);
                    setSelectedApp(null);
                    setNewStatus('');
                    setNewRemarks('');
                    await loadApplications();
                    alert('Stage updated and candidate notified.');
                  } catch (e) {
                    console.error(e);
                    alert('Could not update stage');
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;
