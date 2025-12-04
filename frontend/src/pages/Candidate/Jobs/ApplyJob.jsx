import { useState } from "react";
import axios from "axios";

export default function ApplyJob({ jobId, candidateId }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a resume to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobId", jobId);
    formData.append("candidateId", candidateId);

    try {
      const res = await axios.post(
        "http://localhost:8081/api/job-applications/apply",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(res.data);
    } catch {
      setMessage("Error uploading resume.");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2>Apply for Job</h2>
        <form onSubmit={handleUpload}>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button type="submit" style={{ marginTop: 12 }}>Upload Resume & Apply</button>
        </form>
        {message && <p className="muted" style={{ marginTop: 10 }}>{message}</p>}
      </div>
    </div>
  );
}
