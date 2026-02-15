// import React, { useEffect, useState } from "react";
// import JobApplicationModal from "../../../components/JobApplicationModal/JobApplicationModal";
// import "./CandidateProfile.css";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";

// const emptyExperience = {
//   companyName: "",
//   jobTitle: "",
//   startDate: "",
//   endDate: "",
//   responsibilities: "",
//   achievements: "",
//   technologies: "",
// };
// const emptyEducation = {
//   degree: "",
//   specialization: "",
//   college: "",
//   passingYear: "",
// };
// const emptyCertification = {
//   name: "",
//   organization: "",
//   validity: "",
//   certificateUrl: "",
// };
// const emptyProject = {
//   title: "",
//   description: "",
//   techStack: "",
//   role: "",
//   link: "",
// };

// const CandidateProfile = () => {
//   const { userId: routeUserId } = useParams();
//   const [isJobModalOpen, setIsJobModalOpen] = useState(false);

//   // Personal
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [city, setCity] = useState("");
//   const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

//   // Summary
//   const [currentJobTitle, setCurrentJobTitle] = useState("");
//   const [summary, setSummary] = useState("");

//   // Skills
//   const [skills, setSkills] = useState(""); // Comma-separated string
//   const [allSkills, setAllSkills] = useState([]); // For autocomplete
//   const [skillInput, setSkillInput] = useState(""); // Current input in the skill field
//   const [suggestions, setSuggestions] = useState([]); // Filtered suggestions

//   // Structured sections
//   const [experiences, setExperiences] = useState([{ ...emptyExperience }]);
//   const [education, setEducation] = useState([{ ...emptyEducation }]);
//   const [certifications, setCertifications] = useState([
//     { ...emptyCertification },
//   ]);
//   const [projects, setProjects] = useState([{ ...emptyProject }]);

//   // Attachments
//   const [resumeFile, setResumeFile] = useState(null);
//   const [hasResume, setHasResume] = useState(false);
//   const [coverLetterUrl, setCoverLetterUrl] = useState("");

//   // Additional
//   const [linkedin, setLinkedin] = useState("");
//   const [github, setGithub] = useState("");
//   const [portfolio, setPortfolio] = useState("");
//   const [expectedSalary, setExpectedSalary] = useState("");
//   const [noticePeriod, setNoticePeriod] = useState("");
//   const [preferredJobLocation, setPreferredJobLocation] = useState("");
//   const [jobTypePreference, setJobTypePreference] = useState("");

//   const isSelf = (() => {
//     const storedUserId = String(
//       window.localStorage.getItem("userId") || "",
//     ).trim();
//     const paramUserId = routeUserId ? String(routeUserId).trim() : null;
//     if (!paramUserId) return true; // candidate viewing their own via /candidate/profile
//     return storedUserId !== "" && storedUserId === paramUserId;
//   })();

//   const addItem = (setter, empty) => setter((prev) => [...prev, { ...empty }]);
//   const removeItem = (index, setter) =>
//     setter((prev) => prev.filter((_, i) => i !== index));
//   const updateItem = (index, setter, field, value) =>
//     setter((prev) =>
//       prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
//     );

//   const toJson = (obj) => JSON.stringify(obj);

//   const handleSkillInputChange = (e) => {
//     const value = e.target.value;
//     setSkillInput(value);
//     if (value) {
//       const filtered = allSkills.filter((s) =>
//         s.skill_name.toLowerCase().includes(value.toLowerCase()),
//       );
//       setSuggestions(filtered);
//     } else {
//       setSuggestions(allSkills); // Show all skills if input is empty
//     }
//   };

//   const handleSkillInputFocus = () => {
//     setSuggestions(allSkills);
//   };

//   const handleSkillInputBlur = () => {
//     // Delay to allow click on suggestion
//     setTimeout(() => {
//       setSuggestions([]);
//     }, 150);
//   };

//   const addSkill = (skill) => {
//     const trimmedSkill = skill.trim();
//     if (
//       trimmedSkill &&
//       !skills
//         .split(",")
//         .map((s) => s.trim())
//         .includes(trimmedSkill)
//     ) {
//       setSkills((prev) => (prev ? `${prev}, ${trimmedSkill}` : trimmedSkill));
//     }
//     setSkillInput("");
//     setSuggestions([]);
//   };

//   const removeSkill = (skillToRemove) => {
//     setSkills((prev) =>
//       prev
//         .split(",")
//         .map((s) => s.trim())
//         .filter((s) => s !== skillToRemove)
//         .join(", "),
//     );
//   };

//   const handleSkillInputKeyDown = (e) => {
//     if (e.key === "Enter" && skillInput) {
//       e.preventDefault();
//       addSkill(skillInput);
//     }
//   };

//   const loadProfile = async (uidParam) => {
//     const uidStr =
//       uidParam != null
//         ? String(uidParam)
//         : String(window.localStorage.getItem("userId") || "");
//     const uid = Number(uidStr.trim());
//     if (!Number.isFinite(uid) || uid <= 0) {
//       console.warn("No valid userId found in localStorage or route");
//       return;
//     }
//     try {
//       const res = await fetch(`http://localhost:8081/api/user-profiles/${uid}`);
//       if (res.status === 404) {
//         console.info("No profile found for this user. Form will be empty.");
//         return;
//       }
//       if (!res.ok) throw new Error("Failed to load profile");
//       const p = await res.json();
//       setFullName(p.fullName || "");
//       setEmail(p.email || "");
//       setPhone(p.phone || "");
//       setCity(p.city || "");
//       setProfilePhotoUrl(p.profilePhotoUrl || "");
//       setCurrentJobTitle(p.currentJobTitle || "");
//       setSummary(p.summary || "");
//       setSkills(p.skills || "");
//       setExperiences(
//         p.experiencesJson
//           ? JSON.parse(p.experiencesJson)
//           : [{ ...emptyExperience }],
//       );
//       setEducation(
//         p.educationJson ? JSON.parse(p.educationJson) : [{ ...emptyEducation }],
//       );
//       setCertifications(
//         p.certificationsJson
//           ? JSON.parse(p.certificationsJson)
//           : [{ ...emptyCertification }],
//       );
//       setProjects(
//         p.projectsJson ? JSON.parse(p.projectsJson) : [{ ...emptyProject }],
//       );
//       setHasResume(!!p.resumeFileName); // Check if a resume file name exists
//       const att =
//         p.attachmentsJson && typeof p.attachmentsJson === "string"
//           ? JSON.parse(p.attachmentsJson)
//           : {};
//       setCoverLetterUrl(att.coverLetterUrl || "");
//       setLinkedin(p.linkedin || "");
//       setGithub(p.github || "");
//       setPortfolio(p.portfolio || "");
//       setExpectedSalary(
//         p.expectedSalary != null ? String(p.expectedSalary) : "",
//       );
//       setNoticePeriod(p.noticePeriod || "");
//       setPreferredJobLocation(p.preferredJobLocation || "");
//       setJobTypePreference(p.jobTypePreference || "");
//     } catch (e) {
//       console.error(e);
//       alert("Error loading profile");
//     }
//   };

//   const saveProfile = async () => {
//     const uidStr = String(window.localStorage.getItem("userId") || "");
//     const uid = Number(uidStr.trim());
//     if (!Number.isFinite(uid) || uid <= 0) {
//       alert("No valid user ID found. Please login again.");
//       return;
//     }
//     const salaryVal = String(expectedSalary).trim();
//     const expectedSalaryNum = salaryVal === "" ? null : Number(salaryVal);
//     if (expectedSalaryNum !== null && !Number.isFinite(expectedSalaryNum)) {
//       alert("Expected Salary must be a number (or leave blank)");
//       return;
//     }
//     const payload = {
//       userId: uid,
//       fullName,
//       email,
//       phone,
//       city,
//       profilePhotoUrl,
//       currentJobTitle,
//       summary,
//       skills,
//       experiencesJson: toJson(experiences),
//       educationJson: toJson(education),
//       certificationsJson: toJson(certifications),
//       projectsJson: toJson(projects),
//       attachmentsJson: toJson({ coverLetterUrl }),
//       linkedin,
//       github,
//       portfolio,
//       expectedSalary: expectedSalaryNum,
//       noticePeriod,
//       preferredJobLocation,
//       jobTypePreference,
//     };
//     try {
//       const res = await fetch("http://localhost:8081/api/user-profiles", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         console.error("Save failed:", msg);
//         throw new Error("Save failed");
//       }
//       alert("Profile saved successfully");
//     } catch (e) {
//       console.error(e);
//       alert("Failed to save profile");
//     }
//   };

//   const handleResumeUpload = async () => {
//     const uidStr = String(window.localStorage.getItem("userId") || "");
//     if (!uidStr) {
//       toast.error("You must be logged in to upload a resume.");
//       return;
//     }
//     if (!resumeFile) {
//       toast.warn("Please select a resume file to upload.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("resume", resumeFile);

//     try {
//       const res = await fetch(
//         `http://localhost:8081/api/user-profiles/${uidStr}/resume`,
//         {
//           method: "POST",
//           body: formData,
//         },
//       );

//       if (!res.ok) {
//         const msg = await res.text().catch(() => "");
//         throw new Error(msg || "Failed to upload resume");
//       }

//       toast.success("Resume uploaded successfully!");
//       setHasResume(true);
//       setResumeFile(null);
//       // Clear the file input
//       const fileInput = document.getElementById("resume-upload-input");
//       if (fileInput) fileInput.value = "";
//     } catch (error) {
//       console.error("Resume upload error:", error);
//       toast.error(error.message || "An error occurred during upload.");
//     }
//   };

//   const handleResumeDownload = async () => {
//     const uidStr =
//       routeUserId || String(window.localStorage.getItem("userId") || "");
//     if (!uidStr) {
//       toast.error("Cannot determine user ID.");
//       return;
//     }
//     window.open(
//       `http://localhost:8081/api/user-profiles/${uidStr}/resume`,
//       "_blank",
//     );
//   };

//   useEffect(() => {
//     const storedUserId = window.localStorage.getItem("userId");
//     const paramUserId = routeUserId ? String(routeUserId) : null;
//     const effectiveUserId = paramUserId || storedUserId;
//     if (effectiveUserId) {
//       loadProfile(effectiveUserId);
//     } else {
//       console.warn("No userId in localStorage or route. Please login.");
//     }

//     // Fetch all skills for autocomplete
//     const fetchAllSkills = async () => {
//       try {
//         const res = await fetch("http://localhost:8081/api/skills");
//         if (!res.ok) throw new Error("Failed to fetch skills");
//         const data = await res.json();
//         setAllSkills(data);
//       } catch (error) {
//         console.error(error);
//         toast.error("Could not load skills list.");
//       }
//     };
//     fetchAllSkills();
//   }, [routeUserId]);

//   if (!isSelf) {
//     // Admin read-only view
//     return (
//       <div
//         className="page candidate-profile-page admin-view"
//         style={{
//           padding: "25px",
//           maxWidth: "90%",
//           margin: "0 auto",
//         }}
//       >
//         <div className="page-inner">
//           <div className="page-header">
//             <h1 className="page-title">
//               Candidate Profile (User ID: {routeUserId})
//             </h1>
//             <div
//               className="page-actions profile-actions"
//               style={{ marginBottom: "20px" }}
//             >
//               <button
//                 className="primary"
//                 onClick={() => setIsJobModalOpen(true)}
//               >
//                 Show Job Listings & Apply
//               </button>
//             </div>
//           </div>

//           {isJobModalOpen && (
//             <JobApplicationModal
//               candidateId={routeUserId}
//               onClose={() => setIsJobModalOpen(false)}
//             />
//           )}
//           <div className="profile-grid">
//             <section>
//               <h2>1. Basic Personal Details</h2>
//               <div className="grid-3-compact">
//                 <p>
//                   <strong>Full Name:</strong> {fullName || "—"}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {email || "—"}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {phone || "—"}
//                 </p>
//                 <p>
//                   <strong>City:</strong> {city || "—"}
//                 </p>
//                 {profilePhotoUrl && (
//                   <p>
//                     <strong>Photo:</strong>{" "}
//                     <a
//                       href={profilePhotoUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View
//                     </a>
//                   </p>
//                 )}
//               </div>
//             </section>

//             <section>
//               <h2>2. Professional Summary</h2>
//               <p>
//                 <strong>Current Title:</strong> {currentJobTitle || "—"}
//               </p>
//               <p>
//                 <strong>Summary:</strong> {summary || "—"}
//               </p>
//             </section>

//             <section>
//               <h2>3. Technical Skills</h2>
//               <p>{skills || "—"}</p>
//             </section>

//             <section>
//               <h2>4. Work Experience</h2>
//               {experiences.map(
//                 (exp, idx) =>
//                   exp.companyName && (
//                     <div key={idx} className="card compact">
//                       <p>
//                         <strong>{exp.jobTitle}</strong> at{" "}
//                         <strong>{exp.companyName}</strong> ({exp.startDate} -{" "}
//                         {exp.endDate})
//                       </p>
//                       <p>
//                         <em>Technologies:</em> {exp.technologies}
//                       </p>
//                     </div>
//                   ),
//               )}
//             </section>

//             <section>
//               <h2>5. Education</h2>
//               {education.map(
//                 (ed, idx) =>
//                   ed.degree && (
//                     <div key={idx} className="card compact">
//                       <p>
//                         <strong>
//                           {ed.degree}, {ed.specialization}
//                         </strong>{" "}
//                         - {ed.college} ({ed.passingYear})
//                       </p>
//                     </div>
//                   ),
//               )}
//             </section>

//             <section>
//               <h2>6. Attachments & Links</h2>
//               <div className="grid-3-compact">
//                 {hasResume && (
//                   <button className="primary" onClick={handleResumeDownload}>
//                     Download Resume
//                   </button>
//                 )}
//                 {linkedin && (
//                   <p>
//                     <strong>LinkedIn:</strong>{" "}
//                     <a
//                       href={linkedin}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View
//                     </a>
//                   </p>
//                 )}
//                 {github && (
//                   <p>
//                     <strong>GitHub:</strong>{" "}
//                     <a href={github} target="_blank" rel="noopener noreferrer">
//                       View
//                     </a>
//                   </p>
//                 )}
//                 {portfolio && (
//                   <p>
//                     <strong>Portfolio:</strong>{" "}
//                     <a
//                       href={portfolio}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View
//                     </a>
//                   </p>
//                 )}
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   //</div> Candidate's own editable view
//   return (
//     <div className="page candidate-profile-page" style={{ padding: "25px" }}>
//       <div className="page-inner">
//         <div className="page-header">
//           <h1 className="page-title">
//             Candidate Profile {routeUserId ? `(User ID: ${routeUserId})` : ""}
//           </h1>
//           <div className="page-actions profile-controls">
//             {isSelf && (
//               <button className="primary" onClick={saveProfile}>
//                 Save Profile
//               </button>
//             )}
//           </div>
//         </div>

//         <section>
//           <h2>1. Basic Personal Details</h2>
//           <div className="grid-2">
//             <input
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//             />
//             <input
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <input
//               placeholder="Phone"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//             <input
//               placeholder="City / Location"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//             />
//             <input
//               placeholder="Profile Photo URL (optional)"
//               value={profilePhotoUrl}
//               onChange={(e) => setProfilePhotoUrl(e.target.value)}
//             />
//           </div>
//         </section>

//         <section>
//           <h2>2. Professional Summary</h2>
//           <div className="grid-2">
//             <input
//               placeholder="Current Job Title"
//               value={currentJobTitle}
//               onChange={(e) => setCurrentJobTitle(e.target.value)}
//             />
//             <textarea
//               placeholder="Short Bio / Summary (optional)"
//               value={summary}
//               onChange={(e) => setSummary(e.target.value)}
//             />
//           </div>
//         </section>

//         <section>
//           <h2>3. Technical Skills</h2>
//           <div className="skills-container">
//             <div className="skills-input-wrapper">
//               <input
//                 placeholder="Type a skill and press Enter"
//                 value={skillInput}
//                 onChange={handleSkillInputChange}
//                 onKeyDown={handleSkillInputKeyDown}
//                 onFocus={handleSkillInputFocus}
//                 onBlur={handleSkillInputBlur}
//               />
//               {suggestions.length > 0 && (
//                 <ul className="suggestions-list">
//                   {suggestions.map((s) => (
//                     <li key={s.skill_id} onClick={() => addSkill(s.skill_name)}>
//                       {s.skill_name}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//             <div className="skills-tags">
//               {skills
//                 .split(",")
//                 .filter((s) => s.trim())
//                 .map((skill, i) => (
//                   <div key={i} className="skill-tag">
//                     {skill}
//                     <button onClick={() => removeSkill(skill)}>x</button>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </section>

//         <section>
//           <h2>4. Work Experience</h2>
//           {experiences.map((exp, idx) => (
//             <div key={idx} className="card">
//               <div className="grid-2">
//                 <input
//                   placeholder="Company Name"
//                   value={exp.companyName}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setExperiences,
//                       "companyName",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <input
//                   placeholder="Job Title"
//                   value={exp.jobTitle}
//                   onChange={(e) =>
//                     updateItem(idx, setExperiences, "jobTitle", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Start Date"
//                   value={exp.startDate}
//                   onChange={(e) =>
//                     updateItem(idx, setExperiences, "startDate", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="End Date"
//                   value={exp.endDate}
//                   onChange={(e) =>
//                     updateItem(idx, setExperiences, "endDate", e.target.value)
//                   }
//                 />
//                 <textarea
//                   placeholder="Responsibilities"
//                   value={exp.responsibilities}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setExperiences,
//                       "responsibilities",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <textarea
//                   placeholder="Key Achievements"
//                   value={exp.achievements}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setExperiences,
//                       "achievements",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <input
//                   placeholder="Technologies Used"
//                   value={exp.technologies}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setExperiences,
//                       "technologies",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <button
//                 className="danger"
//                 onClick={() => removeItem(idx, setExperiences)}
//               >
//                 Remove Experience
//               </button>
//             </div>
//           ))}
//           <button onClick={() => addItem(setExperiences, emptyExperience)}>
//             + Add Experience
//           </button>
//         </section>

//         <section>
//           <h2>5. Education</h2>
//           {education.map((ed, idx) => (
//             <div key={idx} className="card">
//               <div className="grid-2">
//                 <input
//                   placeholder="Degree"
//                   value={ed.degree}
//                   onChange={(e) =>
//                     updateItem(idx, setEducation, "degree", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Specialization"
//                   value={ed.specialization}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setEducation,
//                       "specialization",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <input
//                   placeholder="College/University"
//                   value={ed.college}
//                   onChange={(e) =>
//                     updateItem(idx, setEducation, "college", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Passing Year"
//                   value={ed.passingYear}
//                   onChange={(e) =>
//                     updateItem(idx, setEducation, "passingYear", e.target.value)
//                   }
//                 />
//               </div>
//               <button
//                 className="danger"
//                 onClick={() => removeItem(idx, setEducation)}
//               >
//                 Remove Education
//               </button>
//             </div>
//           ))}
//           <button onClick={() => addItem(setEducation, emptyEducation)}>
//             + Add Education
//           </button>
//         </section>

//         <section>
//           <h2>6. Certifications</h2>
//           {certifications.map((c, idx) => (
//             <div key={idx} className="card">
//               <div className="grid-2">
//                 <input
//                   placeholder="Certificate Name"
//                   value={c.name}
//                   onChange={(e) =>
//                     updateItem(idx, setCertifications, "name", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Issuing Organization"
//                   value={c.organization}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setCertifications,
//                       "organization",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <input
//                   placeholder="Validity"
//                   value={c.validity}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setCertifications,
//                       "validity",
//                       e.target.value,
//                     )
//                   }
//                 />
//                 <input
//                   placeholder="Certificate File URL (optional)"
//                   value={c.certificateUrl}
//                   onChange={(e) =>
//                     updateItem(
//                       idx,
//                       setCertifications,
//                       "certificateUrl",
//                       e.target.value,
//                     )
//                   }
//                 />
//               </div>
//               <button
//                 className="danger"
//                 onClick={() => removeItem(idx, setCertifications)}
//               >
//                 Remove Certification
//               </button>
//             </div>
//           ))}
//           <button
//             onClick={() => addItem(setCertifications, emptyCertification)}
//           >
//             + Add Certification
//           </button>
//         </section>

//         <section>
//           <h2>7. Projects</h2>
//           {projects.map((p, idx) => (
//             <div key={idx} className="card">
//               <div className="grid-2">
//                 <input
//                   placeholder="Project Title"
//                   value={p.title}
//                   onChange={(e) =>
//                     updateItem(idx, setProjects, "title", e.target.value)
//                   }
//                 />
//                 <textarea
//                   placeholder="Description"
//                   value={p.description}
//                   onChange={(e) =>
//                     updateItem(idx, setProjects, "description", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Tech Stack"
//                   value={p.techStack}
//                   onChange={(e) =>
//                     updateItem(idx, setProjects, "techStack", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Role in project"
//                   value={p.role}
//                   onChange={(e) =>
//                     updateItem(idx, setProjects, "role", e.target.value)
//                   }
//                 />
//                 <input
//                   placeholder="Project link (GitHub/Live demo)"
//                   value={p.link}
//                   onChange={(e) =>
//                     updateItem(idx, setProjects, "link", e.target.value)
//                   }
//                 />
//               </div>
//               <button
//                 className="danger"
//                 onClick={() => removeItem(idx, setProjects)}
//               >
//                 Remove Project
//               </button>
//             </div>
//           ))}
//           <button onClick={() => addItem(setProjects, emptyProject)}>
//             + Add Project
//           </button>
//         </section>

//         <section>
//           <h2>8. Resume</h2>
//           <div className="attachments-section">
//             <div className="upload-control">
//               <input
//                 id="resume-upload-input"
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={(e) => setResumeFile(e.target.files[0])}
//               />
//               <button
//                 className="primary"
//                 onClick={handleResumeUpload}
//                 disabled={!resumeFile}
//               >
//                 Upload Resume
//               </button>
//             </div>
//             {hasResume && (
//               <div className="download-control">
//                 <p>A resume is already uploaded.</p>
//                 <button className="secondary" onClick={handleResumeDownload}>
//                   Download Resume
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="grid-2">
//             <input
//               placeholder="Cover Letter URL (optional)"
//               value={coverLetterUrl}
//               onChange={(e) => setCoverLetterUrl(e.target.value)}
//             />
//           </div>
//         </section>

//         <section>
//           <h2>9. Additional Preferred Fields</h2>
//           <div className="grid-2">
//             <input
//               placeholder="LinkedIn Profile"
//               value={linkedin}
//               onChange={(e) => setLinkedin(e.target.value)}
//             />
//             <input
//               placeholder="GitHub Profile"
//               value={github}
//               onChange={(e) => setGithub(e.target.value)}
//             />
//             <input
//               placeholder="Portfolio Website"
//               value={portfolio}
//               onChange={(e) => setPortfolio(e.target.value)}
//             />
//             <input
//               placeholder="Expected Salary"
//               value={expectedSalary}
//               onChange={(e) => setExpectedSalary(e.target.value)}
//             />
//             <input
//               placeholder="Notice Period"
//               value={noticePeriod}
//               onChange={(e) => setNoticePeriod(e.target.value)}
//             />
//             <input
//               placeholder="Preferred Job Location"
//               value={preferredJobLocation}
//               onChange={(e) => setPreferredJobLocation(e.target.value)}
//             />
//             <select
//               value={jobTypePreference}
//               onChange={(e) => setJobTypePreference(e.target.value)}
//             >
//               <option value="">Job Type Preference</option>
//               <option value="Remote">Remote</option>
//               <option value="Hybrid">Hybrid</option>
//               <option value="Onsite">Onsite</option>
//             </select>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CandidateProfile;

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
  const [skills, setSkills] = useState(""); // Comma-separated string
  const [allSkills, setAllSkills] = useState([]); // For autocomplete
  const [skillInput, setSkillInput] = useState(""); // Current input in the skill field
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
      window.localStorage.getItem("userId") || "",
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
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );

  const toJson = (obj) => JSON.stringify(obj);

  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value) {
      const filtered = allSkills.filter((s) =>
        s.skill_name.toLowerCase().includes(value.toLowerCase()),
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
    if (
      trimmedSkill &&
      !skills
        .split(",")
        .map((s) => s.trim())
        .includes(trimmedSkill)
    ) {
      setSkills((prev) => (prev ? `${prev}, ${trimmedSkill}` : trimmedSkill));
    }
    setSkillInput("");
    setSuggestions([]);
  };

  const removeSkill = (skillToRemove) => {
    setSkills((prev) =>
      prev
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== skillToRemove)
        .join(", "),
    );
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter" && skillInput) {
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
          : [{ ...emptyExperience }],
      );
      setEducation(
        p.educationJson ? JSON.parse(p.educationJson) : [{ ...emptyEducation }],
      );
      setCertifications(
        p.certificationsJson
          ? JSON.parse(p.certificationsJson)
          : [{ ...emptyCertification }],
      );
      setProjects(
        p.projectsJson ? JSON.parse(p.projectsJson) : [{ ...emptyProject }],
      );
      setHasResume(!!p.resumeFileName); // Check if a resume file name exists
      const att =
        p.attachmentsJson && typeof p.attachmentsJson === "string"
          ? JSON.parse(p.attachmentsJson)
          : {};
      setCoverLetterUrl(att.coverLetterUrl || "");
      setLinkedin(p.linkedin || "");
      setGithub(p.github || "");
      setPortfolio(p.portfolio || "");
      setExpectedSalary(
        p.expectedSalary != null ? String(p.expectedSalary) : "",
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
        },
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
      "_blank",
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
        const res = await fetch("http://localhost:8081/api/skills");
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        setAllSkills(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load skills list.");
      }
    };
    fetchAllSkills();
  }, [routeUserId]);

  // Inline styles
  const styles = {
    page: {
      padding: "32px",
      backgroundColor: "#F2F4F7",
      minHeight: "100vh",
    },
    pageInner: {
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      padding: "32px",
      boxShadow: "0 1px 2px rgba(16, 24, 40, 0.06)",
    },
    pageHeader: {
      marginBottom: "32px",
      paddingBottom: "24px",
      borderBottom: "1px solid #E6EAF0",
    },
    pageTitle: {
      fontSize: "28px",
      fontWeight: "600",
      color: "#1E1E1E",
      margin: "0 0 16px 0",
    },
    pageActions: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
    },
    section: {
      marginBottom: "32px",
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1E1E1E",
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: "2px solid #EAF2FF",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "16px",
    },
    grid3Compact: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "12px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "15px",
      color: "#1E1E1E",
      backgroundColor: "#ffffff",
      border: "1px solid #D9DDE3",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    inputFocus: {
      borderColor: "#0A4EC2",
      boxShadow: "0 0 0 3px rgba(10, 78, 194, 0.22)",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "15px",
      color: "#1E1E1E",
      backgroundColor: "#ffffff",
      border: "1px solid #D9DDE3",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      minHeight: "100px",
      resize: "vertical",
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "15px",
      color: "#1E1E1E",
      backgroundColor: "#ffffff",
      border: "1px solid #D9DDE3",
      borderRadius: "10px",
      outline: "none",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
      cursor: "pointer",
    },
    button: {
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: "500",
      borderRadius: "10px",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "inherit",
    },
    buttonPrimary: {
      backgroundColor: "#0A4EC2",
      color: "#ffffff",
    },
    buttonPrimaryHover: {
      backgroundColor: "#0845AB",
    },
    buttonSecondary: {
      backgroundColor: "#F5F8FE",
      color: "#0A4EC2",
      border: "1px solid #D9DDE3",
    },
    buttonDanger: {
      backgroundColor: "#ffffff",
      color: "#D32F2F",
      border: "1px solid #D9DDE3",
    },
    buttonDangerHover: {
      backgroundColor: "#FFF5F5",
      borderColor: "#D32F2F",
    },
    card: {
      backgroundColor: "#F5F8FE",
      border: "1px solid #E6EAF0",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "16px",
    },
    cardCompact: {
      backgroundColor: "#ffffff",
      border: "1px solid #E6EAF0",
      borderRadius: "10px",
      padding: "16px",
      marginBottom: "12px",
    },
    skillsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    skillsInputWrapper: {
      position: "relative",
    },
    suggestionsList: {
      position: "absolute",
      top: "100%",
      left: "0",
      right: "0",
      backgroundColor: "#ffffff",
      border: "1px solid #D9DDE3",
      borderRadius: "10px",
      marginTop: "4px",
      maxHeight: "200px",
      overflowY: "auto",
      boxShadow: "0 10px 30px rgba(16, 24, 40, 0.10)",
      zIndex: 10,
      listStyle: "none",
      padding: "8px",
      margin: 0,
    },
    suggestionItem: {
      padding: "10px 12px",
      cursor: "pointer",
      borderRadius: "6px",
      color: "#1E1E1E",
      fontSize: "15px",
      transition: "background-color 0.15s ease",
    },
    suggestionItemHover: {
      backgroundColor: "#F5F8FE",
    },
    skillsTags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    },
    skillTag: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      backgroundColor: "#EAF2FF",
      color: "#0A4EC2",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
    },
    skillTagButton: {
      background: "none",
      border: "none",
      color: "#0A4EC2",
      cursor: "pointer",
      fontSize: "16px",
      padding: "0",
      width: "18px",
      height: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      transition: "background-color 0.15s ease",
    },
    skillTagButtonHover: {
      backgroundColor: "#D4E4FF",
    },
    attachmentsSection: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      marginBottom: "16px",
    },
    uploadControl: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      flexWrap: "wrap",
    },
    downloadControl: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "16px",
      backgroundColor: "#F5F8FE",
      borderRadius: "10px",
      border: "1px solid #E6EAF0",
    },
    infoText: {
      color: "#515A6A",
      fontSize: "14px",
      margin: 0,
    },
    readOnlyText: {
      color: "#1E1E1E",
      fontSize: "15px",
      lineHeight: "1.6",
    },
    strong: {
      fontWeight: "600",
      color: "#1E1E1E",
    },
    link: {
      color: "#0A4EC2",
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
    linkHover: {
      color: "#0845AB",
      textDecoration: "underline",
    },
  };

  if (!isSelf) {
    // Admin read-only view
    return (
      <div style={styles.page}>
        <div style={styles.pageInner}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>
              Candidate Profile (User ID: {routeUserId})
            </h1>
            <div style={styles.pageActions}>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={() => setIsJobModalOpen(true)}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#0845AB")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#0A4EC2")
                }
              >
                Show Job Listings & Apply
              </button>
            </div>
          </div>

          {isJobModalOpen && (
            <JobApplicationModal
              candidateId={routeUserId}
              onClose={() => setIsJobModalOpen(false)}
            />
          )}

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Basic Personal Details</h2>
            <div style={styles.grid3Compact}>
              <p style={styles.readOnlyText}>
                <strong style={styles.strong}>Full Name:</strong>{" "}
                {fullName || "—"}
              </p>
              <p style={styles.readOnlyText}>
                <strong style={styles.strong}>Email:</strong> {email || "—"}
              </p>
              <p style={styles.readOnlyText}>
                <strong style={styles.strong}>Phone:</strong> {phone || "—"}
              </p>
              <p style={styles.readOnlyText}>
                <strong style={styles.strong}>City:</strong> {city || "—"}
              </p>
              {profilePhotoUrl && (
                <p style={styles.readOnlyText}>
                  <strong style={styles.strong}>Photo:</strong>{" "}
                  <a
                    href={profilePhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    View
                  </a>
                </p>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Professional Summary</h2>
            <p style={styles.readOnlyText}>
              <strong style={styles.strong}>Current Title:</strong>{" "}
              {currentJobTitle || "—"}
            </p>
            <p style={styles.readOnlyText}>
              <strong style={styles.strong}>Summary:</strong> {summary || "—"}
            </p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Technical Skills</h2>
            <p style={styles.readOnlyText}>{skills || "—"}</p>
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Work Experience</h2>
            {experiences.map(
              (exp, idx) =>
                exp.companyName && (
                  <div key={idx} style={styles.cardCompact}>
                    <p style={styles.readOnlyText}>
                      <strong style={styles.strong}>{exp.jobTitle}</strong> at{" "}
                      <strong style={styles.strong}>{exp.companyName}</strong> (
                      {exp.startDate} - {exp.endDate})
                    </p>
                    <p style={styles.readOnlyText}>
                      <em>Technologies:</em> {exp.technologies}
                    </p>
                  </div>
                ),
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Education</h2>
            {education.map(
              (ed, idx) =>
                ed.degree && (
                  <div key={idx} style={styles.cardCompact}>
                    <p style={styles.readOnlyText}>
                      <strong style={styles.strong}>
                        {ed.degree}, {ed.specialization}
                      </strong>{" "}
                      - {ed.college} ({ed.passingYear})
                    </p>
                  </div>
                ),
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Attachments & Links</h2>
            <div style={styles.grid3Compact}>
              {hasResume && (
                <button
                  style={{ ...styles.button, ...styles.buttonPrimary }}
                  onClick={handleResumeDownload}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#0845AB")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#0A4EC2")
                  }
                >
                  Download Resume
                </button>
              )}
              {linkedin && (
                <p style={styles.readOnlyText}>
                  <strong style={styles.strong}>LinkedIn:</strong>{" "}
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    View
                  </a>
                </p>
              )}
              {github && (
                <p style={styles.readOnlyText}>
                  <strong style={styles.strong}>GitHub:</strong>{" "}
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    View
                  </a>
                </p>
              )}
              {portfolio && (
                <p style={styles.readOnlyText}>
                  <strong style={styles.strong}>Portfolio:</strong>{" "}
                  <a
                    href={portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                    onMouseEnter={(e) =>
                      (e.target.style.textDecoration = "underline")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.textDecoration = "none")
                    }
                  >
                    View
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Candidate's own editable view
  return (
    <div style={styles.page}>
      <div style={styles.pageInner}>
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>
            Candidate Profile {routeUserId ? `(User ID: ${routeUserId})` : ""}
          </h1>
          <div style={styles.pageActions}>
            {isSelf && (
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={saveProfile}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#0845AB")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#0A4EC2")
                }
              >
                Save Profile
              </button>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Basic Personal Details</h2>
          <div style={styles.grid2}>
            <input
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="City / Location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Profile Photo URL (optional)"
              value={profilePhotoUrl}
              onChange={(e) => setProfilePhotoUrl(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Professional Summary</h2>
          <div style={styles.grid2}>
            <input
              style={styles.input}
              placeholder="Current Job Title"
              value={currentJobTitle}
              onChange={(e) => setCurrentJobTitle(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <textarea
              style={styles.textarea}
              placeholder="Short Bio / Summary (optional)"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Technical Skills</h2>
          <div style={styles.skillsContainer}>
            <div style={styles.skillsInputWrapper}>
              <input
                style={styles.input}
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={handleSkillInputChange}
                onKeyDown={handleSkillInputKeyDown}
                onFocus={(e) => {
                  handleSkillInputFocus();
                  e.target.style.borderColor = "#0A4EC2";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(10, 78, 194, 0.22)";
                }}
                onBlur={(e) => {
                  handleSkillInputBlur();
                  e.target.style.borderColor = "#D9DDE3";
                  e.target.style.boxShadow = "none";
                }}
              />
              {suggestions.length > 0 && (
                <ul style={styles.suggestionsList}>
                  {suggestions.map((s) => (
                    <li
                      key={s.skill_id}
                      onClick={() => addSkill(s.skill_name)}
                      style={styles.suggestionItem}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#F5F8FE")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      {s.skill_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={styles.skillsTags}>
              {skills
                .split(",")
                .filter((s) => s.trim())
                .map((skill, i) => (
                  <div key={i} style={styles.skillTag}>
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      style={styles.skillTagButton}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#D4E4FF")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Work Experience</h2>
          {experiences.map((exp, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.grid2}>
                <input
                  style={styles.input}
                  placeholder="Company Name"
                  value={exp.companyName}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "companyName",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "jobTitle", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "startDate", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateItem(idx, setExperiences, "endDate", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Responsibilities"
                  value={exp.responsibilities}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "responsibilities",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Key Achievements"
                  value={exp.achievements}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "achievements",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Technologies Used"
                  value={exp.technologies}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setExperiences,
                      "technologies",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonDanger,
                  marginTop: "12px",
                }}
                onClick={() => removeItem(idx, setExperiences)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFF5F5";
                  e.target.style.borderColor = "#D32F2F";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#D9DDE3";
                }}
              >
                Remove Experience
              </button>
            </div>
          ))}
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => addItem(setExperiences, emptyExperience)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EAF2FF")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F5F8FE")}
          >
            + Add Experience
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Education</h2>
          {education.map((ed, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.grid2}>
                <input
                  style={styles.input}
                  placeholder="Degree"
                  value={ed.degree}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "degree", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Specialization"
                  value={ed.specialization}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setEducation,
                      "specialization",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="College/University"
                  value={ed.college}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "college", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Passing Year"
                  value={ed.passingYear}
                  onChange={(e) =>
                    updateItem(idx, setEducation, "passingYear", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonDanger,
                  marginTop: "12px",
                }}
                onClick={() => removeItem(idx, setEducation)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFF5F5";
                  e.target.style.borderColor = "#D32F2F";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#D9DDE3";
                }}
              >
                Remove Education
              </button>
            </div>
          ))}
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => addItem(setEducation, emptyEducation)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EAF2FF")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F5F8FE")}
          >
            + Add Education
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>6. Certifications</h2>
          {certifications.map((c, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.grid2}>
                <input
                  style={styles.input}
                  placeholder="Certificate Name"
                  value={c.name}
                  onChange={(e) =>
                    updateItem(idx, setCertifications, "name", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Issuing Organization"
                  value={c.organization}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setCertifications,
                      "organization",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Validity"
                  value={c.validity}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setCertifications,
                      "validity",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Certificate File URL (optional)"
                  value={c.certificateUrl}
                  onChange={(e) =>
                    updateItem(
                      idx,
                      setCertifications,
                      "certificateUrl",
                      e.target.value,
                    )
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonDanger,
                  marginTop: "12px",
                }}
                onClick={() => removeItem(idx, setCertifications)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFF5F5";
                  e.target.style.borderColor = "#D32F2F";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#D9DDE3";
                }}
              >
                Remove Certification
              </button>
            </div>
          ))}
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => addItem(setCertifications, emptyCertification)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EAF2FF")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F5F8FE")}
          >
            + Add Certification
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Projects</h2>
          {projects.map((p, idx) => (
            <div key={idx} style={styles.card}>
              <div style={styles.grid2}>
                <input
                  style={styles.input}
                  placeholder="Project Title"
                  value={p.title}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "title", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <textarea
                  style={styles.textarea}
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "description", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Tech Stack"
                  value={p.techStack}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "techStack", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Role in project"
                  value={p.role}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "role", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <input
                  style={styles.input}
                  placeholder="Project link (GitHub/Live demo)"
                  value={p.link}
                  onChange={(e) =>
                    updateItem(idx, setProjects, "link", e.target.value)
                  }
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0A4EC2";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(10, 78, 194, 0.22)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DDE3";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonDanger,
                  marginTop: "12px",
                }}
                onClick={() => removeItem(idx, setProjects)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#FFF5F5";
                  e.target.style.borderColor = "#D32F2F";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.borderColor = "#D9DDE3";
                }}
              >
                Remove Project
              </button>
            </div>
          ))}
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={() => addItem(setProjects, emptyProject)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#EAF2FF")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#F5F8FE")}
          >
            + Add Project
          </button>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Resume</h2>
          <div style={styles.attachmentsSection}>
            <div style={styles.uploadControl}>
              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                style={{
                  ...styles.input,
                  padding: "10px",
                  cursor: "pointer",
                }}
              />
              <button
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  opacity: !resumeFile ? 0.5 : 1,
                  cursor: !resumeFile ? "not-allowed" : "pointer",
                }}
                onClick={handleResumeUpload}
                disabled={!resumeFile}
                onMouseEnter={(e) => {
                  if (resumeFile) e.target.style.backgroundColor = "#0845AB";
                }}
                onMouseLeave={(e) => {
                  if (resumeFile) e.target.style.backgroundColor = "#0A4EC2";
                }}
              >
                Upload Resume
              </button>
            </div>
            {hasResume && (
              <div style={styles.downloadControl}>
                <p style={styles.infoText}>A resume is already uploaded.</p>
                <button
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  onClick={handleResumeDownload}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#EAF2FF")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#F5F8FE")
                  }
                >
                  Download Resume
                </button>
              </div>
            )}
          </div>
          <div style={styles.grid2}>
            <input
              style={styles.input}
              placeholder="Cover Letter URL (optional)"
              value={coverLetterUrl}
              onChange={(e) => setCoverLetterUrl(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Additional Preferred Fields</h2>
          <div style={styles.grid2}>
            <input
              style={styles.input}
              placeholder="LinkedIn Profile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="GitHub Profile"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Portfolio Website"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Expected Salary"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Notice Period"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <input
              style={styles.input}
              placeholder="Preferred Job Location"
              value={preferredJobLocation}
              onChange={(e) => setPreferredJobLocation(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            />
            <select
              style={styles.select}
              value={jobTypePreference}
              onChange={(e) => setJobTypePreference(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "#0A4EC2";
                e.target.style.boxShadow = "0 0 0 3px rgba(10, 78, 194, 0.22)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D9DDE3";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Job Type Preference</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
