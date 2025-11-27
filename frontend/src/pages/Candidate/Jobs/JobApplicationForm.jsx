import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./JobApplicationForm.css";

const JobApplicationForm = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    candidateId: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    collegeName: "",
    degree: "",
    branch: "",
    cpi: "",
    experience: "",
    whyJoin: "",
  });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const uidStr = String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (Number.isFinite(uid) && uid > 0) {
      // Set candidateId automatically
      setFormData((prev) => ({ ...prev, candidateId: String(uid) }));
      // Prefill from UserProfile
      fetch(`http://localhost:8081/api/user-profiles/${uid}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((p) => {
          if (!p) return;
          // Try parse education/experience JSON safely
          let firstEdu = {};
          let firstExp = {};
          try {
            const ed = p.educationJson ? JSON.parse(p.educationJson) : [];
            firstEdu = ed && ed.length ? ed[0] : {};
          } catch {}
          try {
            const ex = p.experiencesJson ? JSON.parse(p.experiencesJson) : [];
            firstExp = ex && ex.length ? ex[0] : {};
          } catch {}

          setFormData((prev) => ({
            ...prev,
            fullName: p.fullName || prev.fullName,
            email: p.email || prev.email,
            phone: p.phone || prev.phone,
            address: p.city || prev.address,
            collegeName: firstEdu.college || prev.collegeName,
            degree: firstEdu.degree || prev.degree,
            branch: firstEdu.specialization || prev.branch,
            // Simple experience summary from first item if available
            experience:
              firstExp && (firstExp.jobTitle || firstExp.companyName)
                ? `${firstExp.jobTitle || ""}${
                    firstExp.jobTitle && firstExp.companyName ? " @ " : ""
                  }${firstExp.companyName || ""}`.trim()
                : prev.experience,
          }));
        })
        .catch((err) => console.error("Failed to prefill profile:", err));
    } else {
      console.warn("No valid userId in localStorage. Please login.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uidStr = formData.candidateId || String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (!Number.isFinite(uid) || uid <= 0) {
      alert("No valid candidate found. Please login again.");
      return;
    }
    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    const data = new FormData();
    Object.entries({ ...formData, candidateId: String(uid) }).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("jobId", jobId);
    data.append("resume", resume);

    setSubmitting(true);
    try {
      const res = await fetch(
        "http://localhost:8081/api/job-applications/apply",
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Failed to submit application");

      alert("Application submitted successfully!");
      window.close();
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-application-form-page">
      <h1>Apply for Job #{jobId}</h1>
      <form onSubmit={handleSubmit} className="job-application-form">
        <div className="form-grid">
          {/* Candidate ID is auto-filled from localStorage; input removed to reduce user error */}

          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
          </label>

          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              required
            />
          </label>

          <label className="full-width">
            Address:
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              required
            />
          </label>

          <label>
            College Name:
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Degree:
            <input
              type="text"
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="e.g. B.Tech, M.Sc"
              required
            />
          </label>

          <label>
            Branch / Major:
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            CPI / CGPA:
            <input
              type="number"
              name="cpi"
              value={formData.cpi}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              required
            />
          </label>

          <label>
            Experience (if any):
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 6 months internship at XYZ"
            />
          </label>

          <label className="full-width">
            Why do you want to join this role?
            <textarea
              name="whyJoin"
              value={formData.whyJoin}
              onChange={handleChange}
              rows="3"
              placeholder="Explain briefly your motivation for applying"
              required
            />
          </label>

          <label className="full-width">
            Upload Resume (PDF):
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
