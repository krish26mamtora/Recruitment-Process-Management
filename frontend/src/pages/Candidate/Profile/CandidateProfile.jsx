import React, { useEffect, useState } from "react";
import "./CandidateProfile.css";

const emptyExperience = { companyName: "", jobTitle: "", startDate: "", endDate: "", responsibilities: "", achievements: "", technologies: "" };
const emptyEducation = { degree: "", specialization: "", college: "", passingYear: "" };
const emptyCertification = { name: "", organization: "", validity: "", certificateUrl: "" };
const emptyProject = { title: "", description: "", techStack: "", role: "", link: "" };

const CandidateProfile = () => {
  const [userId, setUserId] = useState("");

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // Summary
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [summary, setSummary] = useState("");

  // Skills (comma-separated)
  const [skillsLanguages, setSkillsLanguages] = useState("");
  const [skillsFrameworks, setSkillsFrameworks] = useState("");
  const [skillsTools, setSkillsTools] = useState("");
  const [skillsCloud, setSkillsCloud] = useState("");
  const [skillsDatabases, setSkillsDatabases] = useState("");
  const [skillsOther, setSkillsOther] = useState("");

  // Structured sections
  const [experiences, setExperiences] = useState([ { ...emptyExperience } ]);
  const [education, setEducation] = useState([ { ...emptyEducation } ]);
  const [certifications, setCertifications] = useState([ { ...emptyCertification } ]);
  const [projects, setProjects] = useState([ { ...emptyProject } ]);

  // Attachments (URLs for now)
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetterUrl, setCoverLetterUrl] = useState("");

  // Additional
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [preferredJobLocation, setPreferredJobLocation] = useState("");
  const [jobTypePreference, setJobTypePreference] = useState("");

  const addItem = (setter, empty) => setter(prev => [ ...prev, { ...empty } ]);
  const removeItem = (index, setter) => setter(prev => prev.filter((_, i) => i !== index));
  const updateItem = (index, setter, field, value) => setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

  const toJson = (obj) => JSON.stringify(obj);

  const loadProfile = async (uidParam) => {
    const uidStr = uidParam != null ? String(uidParam) : String(window.localStorage.getItem("userId") || "");
    const uid = Number(uidStr.trim());
    if (!Number.isFinite(uid) || uid <= 0) { console.warn("No valid userId found in localStorage"); return; }
    try {
      const res = await fetch(`http://localhost:8081/api/user-profiles/${uid}`);
      if (res.status === 404) { console.info("No profile found for this user. Form will be empty."); return; }
      if (!res.ok) throw new Error("Failed to load profile");
      const p = await res.json();
      setFullName(p.fullName || "");
      setEmail(p.email || "");
      setPhone(p.phone || "");
      setCity(p.city || "");
      setProfilePhotoUrl(p.profilePhotoUrl || "");
      setCurrentJobTitle(p.currentJobTitle || "");
      setSummary(p.summary || "");
      setSkillsLanguages(p.skillsLanguages || "");
      setSkillsFrameworks(p.skillsFrameworks || "");
      setSkillsTools(p.skillsTools || "");
      setSkillsCloud(p.skillsCloud || "");
      setSkillsDatabases(p.skillsDatabases || "");
      setSkillsOther(p.skillsOther || "");
      setExperiences(p.experiencesJson ? JSON.parse(p.experiencesJson) : [ { ...emptyExperience } ]);
      setEducation(p.educationJson ? JSON.parse(p.educationJson) : [ { ...emptyEducation } ]);
      setCertifications(p.certificationsJson ? JSON.parse(p.certificationsJson) : [ { ...emptyCertification } ]);
      setProjects(p.projectsJson ? JSON.parse(p.projectsJson) : [ { ...emptyProject } ]);
      const att = p.attachmentsJson ? JSON.parse(p.attachmentsJson) : {};
      setResumeUrl(att.resumeUrl || "");
      setCoverLetterUrl(att.coverLetterUrl || "");
      setLinkedin(p.linkedin || "");
      setGithub(p.github || "");
      setPortfolio(p.portfolio || "");
      setExpectedSalary(p.expectedSalary != null ? String(p.expectedSalary) : "");
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
    if (!Number.isFinite(uid) || uid <= 0) { alert("No valid user ID found. Please login again."); return; }
    const salaryVal = String(expectedSalary).trim();
    const expectedSalaryNum = salaryVal === "" ? null : Number(salaryVal);
    if (expectedSalaryNum !== null && !Number.isFinite(expectedSalaryNum)) {
      alert("Expected Salary must be a number (or leave blank)");
      return;
    }
    const payload = {
      userId: uid,
      fullName, email, phone, city, profilePhotoUrl,
      currentJobTitle, summary,
      skillsLanguages, skillsFrameworks, skillsTools, skillsCloud, skillsDatabases, skillsOther,
      experiencesJson: toJson(experiences),
      educationJson: toJson(education),
      certificationsJson: toJson(certifications),
      projectsJson: toJson(projects),
      attachmentsJson: toJson({ resumeUrl, coverLetterUrl }),
      linkedin, github, portfolio,
      expectedSalary: expectedSalaryNum,
      noticePeriod, preferredJobLocation, jobTypePreference,
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

  useEffect(() => {
    const storedUserId = window.localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      loadProfile(storedUserId);
    } else {
      console.warn("No userId in localStorage. Please login.");
    }
  }, []);

  return (
    <div className="candidate-profile-page">
      <h1>Candidate Profile</h1>
      <div className="profile-controls">
        <button className="primary" onClick={saveProfile}>Save Profile</button>
      </div>

      <section>
        <h2>1. Basic Personal Details</h2>
        <div className="grid-2">
          <input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <input placeholder="City / Location" value={city} onChange={e => setCity(e.target.value)} />
          <input placeholder="Profile Photo URL (optional)" value={profilePhotoUrl} onChange={e => setProfilePhotoUrl(e.target.value)} />
        </div>
      </section>

      <section>
        <h2>2. Professional Summary</h2>
        <div className="grid-2">
          <input placeholder="Current Job Title" value={currentJobTitle} onChange={e => setCurrentJobTitle(e.target.value)} />
          <textarea placeholder="Short Bio / Summary (optional)" value={summary} onChange={e => setSummary(e.target.value)} />
        </div>
      </section>

      <section>
        <h2>3. Technical Skills</h2>
        <div className="grid-2">
          <input placeholder="Languages (comma separated)" value={skillsLanguages} onChange={e => setSkillsLanguages(e.target.value)} />
          <input placeholder="Frameworks (comma separated)" value={skillsFrameworks} onChange={e => setSkillsFrameworks(e.target.value)} />
          <input placeholder="Tools (comma separated)" value={skillsTools} onChange={e => setSkillsTools(e.target.value)} />
          <input placeholder="Cloud Platforms (comma separated)" value={skillsCloud} onChange={e => setSkillsCloud(e.target.value)} />
          <input placeholder="Databases (comma separated)" value={skillsDatabases} onChange={e => setSkillsDatabases(e.target.value)} />
          <input placeholder="Other technical skills" value={skillsOther} onChange={e => setSkillsOther(e.target.value)} />
        </div>
      </section>

      <section>
        <h2>4. Work Experience</h2>
        {experiences.map((exp, idx) => (
          <div key={idx} className="card">
            <div className="grid-2">
              <input placeholder="Company Name" value={exp.companyName} onChange={e => updateItem(idx, setExperiences, "companyName", e.target.value)} />
              <input placeholder="Job Title" value={exp.jobTitle} onChange={e => updateItem(idx, setExperiences, "jobTitle", e.target.value)} />
              <input placeholder="Start Date" value={exp.startDate} onChange={e => updateItem(idx, setExperiences, "startDate", e.target.value)} />
              <input placeholder="End Date" value={exp.endDate} onChange={e => updateItem(idx, setExperiences, "endDate", e.target.value)} />
              <textarea placeholder="Responsibilities" value={exp.responsibilities} onChange={e => updateItem(idx, setExperiences, "responsibilities", e.target.value)} />
              <textarea placeholder="Key Achievements" value={exp.achievements} onChange={e => updateItem(idx, setExperiences, "achievements", e.target.value)} />
              <input placeholder="Technologies Used" value={exp.technologies} onChange={e => updateItem(idx, setExperiences, "technologies", e.target.value)} />
            </div>
            <button className="danger" onClick={() => removeItem(idx, setExperiences)}>Remove Experience</button>
          </div>
        ))}
        <button onClick={() => addItem(setExperiences, emptyExperience)}>+ Add Experience</button>
      </section>

      <section>
        <h2>5. Education</h2>
        {education.map((ed, idx) => (
          <div key={idx} className="card">
            <div className="grid-2">
              <input placeholder="Degree" value={ed.degree} onChange={e => updateItem(idx, setEducation, "degree", e.target.value)} />
              <input placeholder="Specialization" value={ed.specialization} onChange={e => updateItem(idx, setEducation, "specialization", e.target.value)} />
              <input placeholder="College/University" value={ed.college} onChange={e => updateItem(idx, setEducation, "college", e.target.value)} />
              <input placeholder="Passing Year" value={ed.passingYear} onChange={e => updateItem(idx, setEducation, "passingYear", e.target.value)} />
            </div>
            <button className="danger" onClick={() => removeItem(idx, setEducation)}>Remove Education</button>
          </div>
        ))}
        <button onClick={() => addItem(setEducation, emptyEducation)}>+ Add Education</button>
      </section>

      <section>
        <h2>6. Certifications</h2>
        {certifications.map((c, idx) => (
          <div key={idx} className="card">
            <div className="grid-2">
              <input placeholder="Certificate Name" value={c.name} onChange={e => updateItem(idx, setCertifications, "name", e.target.value)} />
              <input placeholder="Issuing Organization" value={c.organization} onChange={e => updateItem(idx, setCertifications, "organization", e.target.value)} />
              <input placeholder="Validity" value={c.validity} onChange={e => updateItem(idx, setCertifications, "validity", e.target.value)} />
              <input placeholder="Certificate File URL (optional)" value={c.certificateUrl} onChange={e => updateItem(idx, setCertifications, "certificateUrl", e.target.value)} />
            </div>
            <button className="danger" onClick={() => removeItem(idx, setCertifications)}>Remove Certification</button>
          </div>
        ))}
        <button onClick={() => addItem(setCertifications, emptyCertification)}>+ Add Certification</button>
      </section>

      <section>
        <h2>7. Projects</h2>
        {projects.map((p, idx) => (
          <div key={idx} className="card">
            <div className="grid-2">
              <input placeholder="Project Title" value={p.title} onChange={e => updateItem(idx, setProjects, "title", e.target.value)} />
              <textarea placeholder="Description" value={p.description} onChange={e => updateItem(idx, setProjects, "description", e.target.value)} />
              <input placeholder="Tech Stack" value={p.techStack} onChange={e => updateItem(idx, setProjects, "techStack", e.target.value)} />
              <input placeholder="Role in project" value={p.role} onChange={e => updateItem(idx, setProjects, "role", e.target.value)} />
              <input placeholder="Project link (GitHub/Live demo)" value={p.link} onChange={e => updateItem(idx, setProjects, "link", e.target.value)} />
            </div>
            <button className="danger" onClick={() => removeItem(idx, setProjects)}>Remove Project</button>
          </div>
        ))}
        <button onClick={() => addItem(setProjects, emptyProject)}>+ Add Project</button>
      </section>

      <section>
        <h2>8. Attachments</h2>
        <div className="grid-2">
          <input placeholder="Resume File URL (PDF)" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} />
          <input placeholder="Cover Letter URL (optional)" value={coverLetterUrl} onChange={e => setCoverLetterUrl(e.target.value)} />
        </div>
      </section>

      <section>
        <h2>9. Additional Preferred Fields</h2>
        <div className="grid-2">
          <input placeholder="LinkedIn Profile" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
          <input placeholder="GitHub Profile" value={github} onChange={e => setGithub(e.target.value)} />
          <input placeholder="Portfolio Website" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
          <input placeholder="Expected Salary" value={expectedSalary} onChange={e => setExpectedSalary(e.target.value)} />
          <input placeholder="Notice Period" value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)} />
          <input placeholder="Preferred Job Location" value={preferredJobLocation} onChange={e => setPreferredJobLocation(e.target.value)} />
          <select value={jobTypePreference} onChange={e => setJobTypePreference(e.target.value)}>
            <option value="">Job Type Preference</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
      </section>
    </div>
  );
};

export default CandidateProfile;