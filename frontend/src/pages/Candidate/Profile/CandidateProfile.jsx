import React, { useEffect, useState } from "react";
import JobApplicationModal from "../../../components/JobApplicationModal/JobApplicationModal";
import "./CandidateProfile.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const emptyExperience = {
  companyName: "",
  jobTitle: "",
  startDate: "",
  endDate: "",
  responsibilities: "",
  achievements: "",
  technologies: "",
};
const emptyEducation = {
  degree: "",
  specialization: "",
  college: "",
  passingYear: "",
};
const emptyCertification = {
  name: "",
  organization: "",
  validity: "",
  certificateUrl: "",
};
const emptyProject = {
  title: "",
  description: "",
  techStack: "",
  role: "",
  link: "",
};

const CandidateProfile = () => {
  const { userId: routeUserId } = useParams();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // Summary
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [summary, setSummary] = useState("");

  // Skills
  const [skills, setSkills] = useState(''); // Comma-separated string
  const [allSkills, setAllSkills] = useState([]); // For autocomplete
  const [skillInput, setSkillInput] = useState(''); // Current input in the skill field
  const [suggestions, setSuggestions] = useState([]); // Filtered suggestions

  // Structured sections
  const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
  const [education, setEducation] = useState([{ ...emptyEducation }]);
  const [certifications, setCertifications] = useState([
    { ...emptyCertification },
  ]);
  const [projects, setProjects] = useState([{ ...emptyProject }]);

  // Attachments
  const [resumeFile, setResumeFile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [coverLetterUrl, setCoverLetterUrl] = useState("");

  // Additional
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [preferredJobLocation, setPreferredJobLocation] = useState("");
  const [jobTypePreference, setJobTypePreference] = useState("");

  const isSelf = (() => {
    const storedUserId = String(
      window.localStorage.getItem("userId") || ""
    ).trim();
    const paramUserId = routeUserId ? String(routeUserId).trim() : null;
    if (!paramUserId) return true; // candidate viewing their own via /candidate/profile
    return storedUserId !== "" && storedUserId === paramUserId;
  })();

  const addItem = (setter, empty) => setter((prev) => [...prev, { ...empty }]);
  const removeItem = (index, setter) =>
    setter((prev) => prev.filter((_, i) => i !== index));
  const updateItem = (index, setter, field, value) =>
    setter((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );

  const toJson = (obj) => JSON.stringify(obj);

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value) {
      const filtered = allSkills.filter(s =>
        s.skill_name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(allSkills); // Show all skills if input is empty
    }
  };

  const handleSkillInputFocus = () => {
    setSuggestions(allSkills);
  };

  const handleSkillInputBlur = () => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setSuggestions([]);
    }, 150);
  };

  const addSkill = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.split(',').map(s => s.trim()).includes(trimmedSkill)) {
      setSkills(prev => prev ? `${prev}, ${trimmedSkill}` : trimmedSkill);
    }
    setSkillInput('');
    setSuggestions([]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prev =>
      prev.split(',').map(s => s.trim()).filter(s => s !== skillToRemove).join(', ')
    );
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput) {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const loadProfile = async (uidParam) => {
    const uidStr =
      uidParam != null
        ? String(uidParam)
        : String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (!Number.isFinite(uid) || uid <= 0) {
      console.warn("No valid userId found in localStorage or route");
      return;
    }
    try {
      const res = await fetch(`http://localhost:8081/api/user-profiles/${uid}`);
      if (res.status === 404) {
        console.info("No profile found for this user. Form will be empty.");
        return;
      }
      if (!res.ok) throw new Error("Failed to load profile");
      const p = await res.json();
      setFullName(p.fullName || "");
      setEmail(p.email || "");
      setPhone(p.phone || "");
      setCity(p.city || "");
      setProfilePhotoUrl(p.profilePhotoUrl || "");
      setCurrentJobTitle(p.currentJobTitle || "");
      setSummary(p.summary || "");
      setSkills(p.skills || "");
      setExperiences(
        p.experiencesJson
          ? JSON.parse(p.experiencesJson)
          : [{ ...emptyExperience }]
      );
      setEducation(
        p.educationJson ? JSON.parse(p.educationJson) : [{ ...emptyEducation }]
      );
      setCertifications(
        p.certificationsJson
          ? JSON.parse(p.certificationsJson)
          : [{ ...emptyCertification }]
      );
      setProjects(
        p.projectsJson ? JSON.parse(p.projectsJson) : [{ ...emptyProject }]
      );
      setHasResume(!!p.resumeFileName); // Check if a resume file name exists
      const att = p.attachmentsJson && typeof p.attachmentsJson === 'string' ? JSON.parse(p.attachmentsJson) : {};
      setCoverLetterUrl(att.coverLetterUrl || "");
      setLinkedin(p.linkedin || "");
      setGithub(p.github || "");
      setPortfolio(p.portfolio || "");
      setExpectedSalary(
        p.expectedSalary != null ? String(p.expectedSalary) : ""
      );
      setNoticePeriod(p.noticePeriod || "");
      setPreferredJobLocation(p.preferredJobLocation || "");
      setJobTypePreference(p.jobTypePreference || "");
    } catch (e) {
      console.error(e);
      alert("Error loading profile");
    }
  };

  const saveProfile = async () => {
    const uidStr = String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (!Number.isFinite(uid) || uid <= 0) {
      alert("No valid user ID found. Please login again.");
      return;
    }
    const salaryVal = String(expectedSalary).trim();
    const expectedSalaryNum = salaryVal === "" ? null : Number(salaryVal);
    if (expectedSalaryNum !== null && !Number.isFinite(expectedSalaryNum)) {
      alert("Expected Salary must be a number (or leave blank)");
      return;
    }
    const payload = {
      userId: uid,
      fullName,
      email,
      phone,
      city,
      profilePhotoUrl,
      currentJobTitle,
      summary,
      skills,
      experiencesJson: toJson(experiences),
      educationJson: toJson(education),
      certificationsJson: toJson(certifications),
      projectsJson: toJson(projects),
      attachmentsJson: toJson({ coverLetterUrl }),
      linkedin,
      github,
      portfolio,
      expectedSalary: expectedSalaryNum,
      noticePeriod,
      preferredJobLocation,
      jobTypePreference,
    };
    try {
      const res = await fetch("http://localhost:8081/api/user-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        console.error("Save failed:", msg);
        throw new Error("Save failed");
      }
      alert("Profile saved successfully");
    } catch (e) {
      console.error(e);
      alert("Failed to save profile");
    }
  };

  const handleResumeUpload = async () => {
    const uidStr = String(window.localStorage.getItem("userId") || "");
    if (!uidStr) {
      toast.error("You must be logged in to upload a resume.");
      return;
    }
    if (!resumeFile) {
      toast.warn("Please select a resume file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const res = await fetch(
        `http://localhost:8081/api/user-profiles/${uidStr}/resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Failed to upload resume");
      }

      toast.success("Resume uploaded successfully!");
      setHasResume(true);
      setResumeFile(null);
      // Clear the file input
      const fileInput = document.getElementById("resume-upload-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Resume upload error:", error);
      toast.error(error.message || "An error occurred during upload.");
    }
  };

  const handleResumeDownload = async () => {
    const uidStr =
      routeUserId || String(window.localStorage.getItem("userId") || "");
    if (!uidStr) {
      toast.error("Cannot determine user ID.");
      return;
    }
    window.open(
      `http://localhost:8081/api/user-profiles/${uidStr}/resume`,
      "_blank"
    );
  };

  useEffect(() => {
    const storedUserId = window.localStorage.getItem("userId");
    const paramUserId = routeUserId ? String(routeUserId) : null;
    const effectiveUserId = paramUserId || storedUserId;
    if (effectiveUserId) {
      loadProfile(effectiveUserId);
    } else {
      console.warn("No userId in localStorage or route. Please login.");
    }

    // Fetch all skills for autocomplete
    const fetchAllSkills = async () => {
      try {
        const res = await fetch('http://localhost:8081/api/skills');
        if (!res.ok) throw new Error('Failed to fetch skills');
        const data = await res.json();
        setAllSkills(data);
      } catch (error) {
        console.error(error);
        toast.error('Could not load skills list.');
      }
    };
    fetchAllSkills();
  }, [routeUserId]);


  if (!isSelf) {
    // Admin read-only view
    return (
      <div className="page candidate-profile-page admin-view">
        <div className="page-inner">
          <div className="page-header">
            <h1 className="page-title">Candidate Profile (User ID: {routeUserId})</h1>
            <div className="page-actions profile-actions" style={{ marginBottom: '20px' }}>
              <button className="primary" onClick={() => setIsJobModalOpen(true)}>Show Job Listings & Apply</button>
            </div>
          </div>

          {isJobModalOpen && (
            <JobApplicationModal
              candidateId={routeUserId}
              onClose={() => setIsJobModalOpen(false)}
            />
          )}
          <div className="profile-grid">
            <section>
              <h2>1. Basic Personal Details</h2>
              <div className="grid-3-compact">
                <p><strong>Full Name:</strong> {fullName || '—'}</p>
                <p><strong>Email:</strong> {email || '—'}</p>
                <p><strong>Phone:</strong> {phone || '—'}</p>
                <p><strong>City:</strong> {city || '—'}</p>
                {profilePhotoUrl && <p><strong>Photo:</strong> <a href={profilePhotoUrl} target="_blank" rel="noopener noreferrer">View</a></p>}
              </div>
            </section>

            <section>
              <h2>2. Professional Summary</h2>
              <p><strong>Current Title:</strong> {currentJobTitle || '—'}</p>
              <p><strong>Summary:</strong> {summary || '—'}</p>
            </section>

            <section>
              <h2>3. Technical Skills</h2>
              <p>{skills || '—'}</p>
            </section>

            <section>
              <h2>4. Work Experience</h2>
              {experiences.map((exp, idx) => exp.companyName && (
                <div key={idx} className="card compact">
                  <p><strong>{exp.jobTitle}</strong> at <strong>{exp.companyName}</strong> ({exp.startDate} - {exp.endDate})</p>
                  <p><em>Technologies:</em> {exp.technologies}</p>
                </div>
              ))}
            </section>

            <section>
              <h2>5. Education</h2>
              {education.map((ed, idx) => ed.degree && (
                <div key={idx} className="card compact">
                  <p><strong>{ed.degree}, {ed.specialization}</strong> - {ed.college} ({ed.passingYear})</p>
                </div>
              ))}
            </section>

            <section>
              <h2>6. Attachments & Links</h2>
              <div className="grid-3-compact">
                {hasResume && <button className="primary" onClick={handleResumeDownload}>Download Resume</button>}
                {linkedin && <p><strong>LinkedIn:</strong> <a href={linkedin} target="_blank" rel="noopener noreferrer">View</a></p>}
                {github && <p><strong>GitHub:</strong> <a href={github} target="_blank" rel="noopener noreferrer">View</a></p>}
                {portfolio && <p><strong>Portfolio:</strong> <a href={portfolio} target="_blank" rel="noopener noreferrer">View</a></p>}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  //</div> Candidate's own editable view
  return (
    <div className="page candidate-profile-page">
      <div className="page-inner">
        <div className="page-header">
          <h1 className="page-title">
            Candidate Profile {routeUserId ? `(User ID: ${routeUserId})` : ""}
          </h1>
          <div className="page-actions profile-controls">
            {isSelf && (
              <button className="primary" onClick={saveProfile}>
                Save Profile
              </button>
            )}
          </div>
        </div>

        <section>
          <h2>1. Basic Personal Details</h2>
          <div className="grid-2">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              placeholder="City / Location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              placeholder="Profile Photo URL (optional)"
              value={profilePhotoUrl}
              onChange={(e) => setProfilePhotoUrl(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2>2. Professional Summary</h2>
          <div className="grid-2">
            <input
              placeholder="Current Job Title"
              value={currentJobTitle}
              onChange={(e) => setCurrentJobTitle(e.target.value)}
            />
            <textarea
              placeholder="Short Bio / Summary (optional)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2>3. Technical Skills</h2>
          <div className="skills-container">
            <div className="skills-input-wrapper">
              <input
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={handleSkillInputChange}
                onKeyDown={handleSkillInputKeyDown}
                onFocus={handleSkillInputFocus}
                onBlur={handleSkillInputBlur}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(s => (
                    <li key={s.skill_id} onClick={() => addSkill(s.skill_name)}>
                      {s.skill_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="skills-tags">
              {skills.split(',').filter(s => s.trim()).map((skill, i) => (
                <div key={i} className="skill-tag">
                  {skill}
                  <button onClick={() => removeSkill(skill)}>x</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2>4. Work Experience</h2>
          {experiences.map((exp, idx) => (
            <div key={idx} className="card">
              <div className="grid-2">
                <input
                  placeholder="Company Name"
                  value={exp.companyName}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "companyName", e.target.value)
                  }
                />
                <input
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "jobTitle", e.target.value)
                  }
                />
                <input
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "startDate", e.target.value)
                  }
                />
                <input
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "endDate", e.target.value)
                  }
                />
                <textarea
                  placeholder="Responsibilities"
                  value={exp.responsibilities}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "responsibilities",
                      e.target.value
                    )
                  }
                />
                <textarea
                  placeholder="Key Achievements"
                  value={exp.achievements}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "achievements",
                      e.target.value
                    )
                  }
                />
                <input
                  placeholder="Technologies Used"
                  value={exp.technologies}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "technologies",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="danger"
                onClick={() => removeItem(idx, setExperiences)}
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button onClick={() => addItem(setExperiences, emptyExperience)}>
            + Add Experience
          </button>
        </section>

        <section>
          <h2>5. Education</h2>
          {education.map((ed, idx) => (
            <div key={idx} className="card">
              <div className="grid-2">
                <input
                  placeholder="Degree"
                  value={ed.degree}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "degree", e.target.value)
                  }
                />
                <input
                  placeholder="Specialization"
                  value={ed.specialization}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setEducation,
                      "specialization",
                      e.target.value
                    )
                  }
                />
                <input
                  placeholder="College/University"
                  value={ed.college}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "college", e.target.value)
                  }
                />
                <input
                  placeholder="Passing Year"
                  value={ed.passingYear}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "passingYear", e.target.value)
                  }
                />
              </div>
              <button
                className="danger"
                onClick={() => removeItem(idx, setEducation)}
              >
                Remove Education
              </button>
            </div>
          ))}
          <button onClick={() => addItem(setEducation, emptyEducation)}>
            + Add Education
          </button>
        </section>

        <section>
          <h2>6. Certifications</h2>
          {certifications.map((c, idx) => (
            <div key={idx} className="card">
              <div className="grid-2">
                <input
                  placeholder="Certificate Name"
                  value={c.name}
                  onChange={(e) =>
                    updateItem(idx, setCertifications, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Issuing Organization"
                  value={c.organization}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setCertifications,
                      "organization",
                      e.target.value
                    )
                  }
                />
                <input
                  placeholder="Validity"
                  value={c.validity}
                  onChange={(e) =>
                    updateItem(idx, setCertifications, "validity", e.target.value)
                  }
                />
                <input
                  placeholder="Certificate File URL (optional)"
                  value={c.certificateUrl}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setCertifications,
                      "certificateUrl",
                      e.target.value
                    )
                  }
                />
              </div>
              <button
                className="danger"
                onClick={() => removeItem(idx, setCertifications)}
              >
                Remove Certification
              </button>
            </div>
          ))}
          <button onClick={() => addItem(setCertifications, emptyCertification)}>
            + Add Certification
          </button>
        </section>

        <section>
          <h2>7. Projects</h2>
          {projects.map((p, idx) => (
            <div key={idx} className="card">
              <div className="grid-2">
                <input
                  placeholder="Project Title"
                  value={p.title}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "title", e.target.value)
                  }
                />
                <textarea
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "description", e.target.value)
                  }
                />
                <input
                  placeholder="Tech Stack"
                  value={p.techStack}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "techStack", e.target.value)
                  }
                />
                <input
                  placeholder="Role in project"
                  value={p.role}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "role", e.target.value)
                  }
                />
                <input
                  placeholder="Project link (GitHub/Live demo)"
                  value={p.link}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "link", e.target.value)
                  }
                />
              </div>
              <button
                className="danger"
                onClick={() => removeItem(idx, setProjects)}
              >
                Remove Project
              </button>
            </div>
          ))}
          <button onClick={() => addItem(setProjects, emptyProject)}>
            + Add Project
          </button>
        </section>

        <section>
          <h2>8. Resume</h2>
          <div className="attachments-section">
            <div className="upload-control">
              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              <button
                className="primary"
                onClick={handleResumeUpload}
                disabled={!resumeFile}
              >
                Upload Resume
              </button>
            </div>
            {hasResume && (
              <div className="download-control">
                <p>A resume is already uploaded.</p>
                <button className="secondary" onClick={handleResumeDownload}>
                  Download Resume
                </button>
              </div>
            )}
          </div>
          <div className="grid-2">
            <input
              placeholder="Cover Letter URL (optional)"
              value={coverLetterUrl}
              onChange={(e) => setCoverLetterUrl(e.target.value)}
            />
          </div>
        </section>

        <section>
          <h2>9. Additional Preferred Fields</h2>
          <div className="grid-2">
            <input
              placeholder="LinkedIn Profile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <input
              placeholder="GitHub Profile"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <input
              placeholder="Portfolio Website"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
            />
            <input
              placeholder="Expected Salary"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
            <input
              placeholder="Notice Period"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
            />
            <input
              placeholder="Preferred Job Location"
              value={preferredJobLocation}
              onChange={(e) => setPreferredJobLocation(e.target.value)}
            />
            <select
              value={jobTypePreference}
              onChange={(e) => setJobTypePreference(e.target.value)}
            >
              <option value="">Job Type Preference</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CandidateProfile;
