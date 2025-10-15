// JobForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./JobForm.css";

const empty = {
  title: "",
  description: "",
  minExperienceYears: "",
  status: "open",
  reasonClosed: "",
  assignedRecruiterId: null,
  assignedRecruiterName: null,
  skills: [],
};

const JobForm = () => {
  const { id } = useParams(); // edit id
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  // Fetch job if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:8081/api/jobs/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Job not found");
          return res.json();
        })
        .then((j) =>
          setForm({
            ...j,
            minExperienceYears: j.minExperienceYears ?? "",
            reasonClosed: j.reasonClosed ?? "",
          })
        )
        .catch((err) => {
          console.error(err);
          alert("Cannot load job");
          navigate("/admin/jobs");
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      minExperienceYears: form.minExperienceYears
        ? Number(form.minExperienceYears)
        : null,
      status: form.status,
      reasonClosed: form.reasonClosed || null,
      assignedRecruiterId: form.assignedRecruiterId || null,
      assignedRecruiterName: form.assignedRecruiterName || null,
      skills: form.skills || [],
    };

    try {
      let res;
      if (id) {
        // Update existing job
        const response = await fetch(`http://localhost:8081/api/jobs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update job");
        res = await response.json();
      } else {
        // Create new job
        const response = await fetch(`http://localhost:8081/api/jobs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, createdBy: 1 }),
        });
        if (!response.ok) throw new Error("Failed to create job");
        res = await response.json();
      }

      alert(`Job ${id ? "updated" : "created"} successfully`);
      navigate(`/admin/jobs/${res.jobId}`);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  // Temporary skill add (UI only)
  const [newSkill, setNewSkill] = useState("");
  const addSkill = () => {
    if (!newSkill.trim()) return;
    setForm((f) => ({
      ...f,
      skills: [
        ...(f.skills || []),
        { skillId: Date.now(), skillName: newSkill.trim(), required: true },
      ],
    }));
    setNewSkill("");
  };

  return (
    <div className="job-form-page">
      <div className="job-form-card">
        <h2>{id ? "Edit Job" : "Create Job"}</h2>

        {loading && <div className="loading">Loading...</div>}

        <form className="job-form" onSubmit={handleSubmit}>
          <label>
            Title <span className="required">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
          />

          <div className="two-col">
            <div>
              <label>Minimum Experience (years)</label>
              <input
                name="minExperienceYears"
                type="number"
                min="0"
                value={form.minExperienceYears}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="open">Open</option>
                <option value="on_hold">On Hold</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {form.status === "closed" && (
            <>
              <label>Reason for closing</label>
              <textarea
                name="reasonClosed"
                value={form.reasonClosed}
                onChange={handleChange}
              ></textarea>
            </>
          )}

          <label>Assigned Recruiter (name)</label>
          <input
            name="assignedRecruiterName"
            value={form.assignedRecruiterName || ""}
            onChange={handleChange}
            placeholder="Recruiter name (optional)"
          />

          <label>Skills</label>
          <div className="skills-row">
            {(form.skills || []).map((s) => (
              <span key={s.skillId} className="skill-pill">
                {s.skillName}
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      skills: f.skills.filter((x) => x.skillId !== s.skillId),
                    }))
                  }
                >
                  &times;
                </button>
              </span>
            ))}
            <div className="add-skill">
              <input
                value={newSkill}
                placeholder="Add skill (e.g. React)"
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button type="button" onClick={addSkill}>
                Add
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {id ? "Save Changes" : "Create Job"}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => navigate("/admin/jobs")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
