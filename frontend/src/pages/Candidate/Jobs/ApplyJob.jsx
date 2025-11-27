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
    } catch (error) {
      setMessage("Error uploading resume.");
    }
  };

  return (
    <div className="p-4 border rounded w-96 mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Apply for Job</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-3"
        >
          Upload Resume & Apply
        </button>
      </form>
      {message && <p className="mt-3 text-green-600">{message}</p>}
    </div>
  );
}
