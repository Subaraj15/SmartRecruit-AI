// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import "../CSS/RecruiterJobs.css";

// export default function Jobs() {
//   const navigate = useNavigate();

//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [requiredSkills, setRequiredSkills] = useState("");
//   const [experience, setExperience] = useState("");

//   const [editingId, setEditingId] = useState(null);
//   const [expandedJob, setExpandedJob] = useState(null);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Load jobs belonging only to the logged-in recruiter
//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const [jobsResponse, applicationsResponse] = await Promise.all([
//         api.get("/api/jobs/my-jobs"),
//         api.get("/api/applications/recruiter/my-applications"),
//       ]);

//       setJobs(jobsResponse.data || []);
//       setApplications(applicationsResponse.data || []);
//       setMessage("");
//     } catch (error) {
//       console.error("Loading recruiter data failed:", error);

//       setMessage(
//         error.response?.status === 403
//           ? "Access denied. Please login as a recruiter."
//           : "Unable to load jobs or applications."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Group applications by job ID
//   const applicationsByJob = useMemo(() => {
//     const grouped = {};

//     applications.forEach((app) => {
//       if (!grouped[app.jobId]) {
//         grouped[app.jobId] = [];
//       }

//       grouped[app.jobId].push(app);
//     });

//     return grouped;
//   }, [applications]);

//   // Dashboard statistics
//   const totalApplicants = applications.length;

//   const shortlistedCount = applications.filter(
//     (app) => app.status?.toLowerCase() === "shortlisted"
//   ).length;

//   const hiredCount = applications.filter(
//     (app) => app.status?.toLowerCase() === "hired"
//   ).length;

//   // Create / Update job
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setMessage("");

//     try {
//       const jobData = {
//         title,
//         description,
//         requiredSkills,
//         experience: Number(experience),
//       };

//       if (editingId) {
//         await api.put(`/api/jobs/${editingId}`, jobData);
//         setMessage("Job updated successfully!");
//       } else {
//         await api.post("/api/jobs", jobData);
//         setMessage("Job posted successfully!");
//       }

//       clearForm();
//       await loadData();
//     } catch (error) {
//       console.error("Job save failed:", error);

//       setMessage(
//         error.response?.data?.message ||
//           error.response?.data ||
//           "Unable to save job."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Edit job
//   const handleEdit = (job) => {
//     setEditingId(job.id);
//     setTitle(job.title || "");
//     setDescription(job.description || "");
//     setRequiredSkills(job.requiredSkills || "");
//     setExperience(job.experience ?? "");

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // Delete job
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this job?")) {
//       return;
//     }

//     try {
//       await api.delete(`/api/jobs/${id}`);
//       setMessage("Job deleted successfully!");
//       setExpandedJob(null);
//       await loadData();
//     } catch (error) {
//       console.error("Delete failed:", error);
//       setMessage("Unable to delete job.");
//     }
//   };

//   // Update applicant status
//   const handleStatusChange = async (applicationId, status) => {
//     try {
//       await api.put(
//         `/api/applications/status/${applicationId}`,
//         null,
//         {
//           params: { status },
//         }
//       );

//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === applicationId
//             ? { ...app, status }
//             : app
//         )
//       );

//       setMessage("Applicant status updated!");
//     } catch (error) {
//       console.error("Status update failed:", error);
//       setMessage("Unable to update applicant status.");
//     }
//   };

//   // Clear form
//   const clearForm = () => {
//     setTitle("");
//     setDescription("");
//     setRequiredSkills("");
//     setExperience("");
//     setEditingId(null);
//   };

//   // Expand applicant section
//   const toggleApplicants = (jobId) => {
//     setExpandedJob((prev) => (prev === jobId ? null : jobId));
//   };

//   return (
//     <div className="rj-page">
//       {/* Header */}
//       <header className="rj-topbar">
//         <div className="rj-brand">
//           <div className="rj-brand-icon">S</div>
//           <div>
//             <h2>SmartRecruit AI</h2>
//             <span>Recruiter workspace</span>
//           </div>
//         </div>

//         <button
//           className="rj-back-btn"
//           onClick={() => navigate("/recruiter/dashboard")}
//         >
//           ← Dashboard
//         </button>
//       </header>

//       <main className="rj-container">
//         {/* Heading */}
//         <section className="rj-heading">
//           <div>
//             <span className="rj-eyebrow">RECRUITMENT MANAGEMENT</span>
//             <h1>Manage Job Postings</h1>
//             <p>
//               Create opportunities and review candidates who apply
//               to your jobs.
//             </p>
//           </div>
//         </section>

//         {/* Statistics */}
//         <section className="rj-stats">
//           <div className="rj-stat-card">
//             <div className="rj-stat-icon rj-purple">▤</div>
//             <div>
//               <span>Total Job Postings</span>
//               <h2>{jobs.length}</h2>
//             </div>
//           </div>

//           <div className="rj-stat-card">
//             <div className="rj-stat-icon rj-blue">♙</div>
//             <div>
//               <span>Total Applicants</span>
//               <h2>{totalApplicants}</h2>
//             </div>
//           </div>

//           <div className="rj-stat-card">
//             <div className="rj-stat-icon rj-green">✓</div>
//             <div>
//               <span>Shortlisted</span>
//               <h2>{shortlistedCount}</h2>
//             </div>
//           </div>

//           <div className="rj-stat-card">
//             <div className="rj-stat-icon rj-orange">★</div>
//             <div>
//               <span>Hired</span>
//               <h2>{hiredCount}</h2>
//             </div>
//           </div>
//         </section>

//         {/* Message */}
//         {message && (
//           <div className="rj-message">
//             <span>{message}</span>
//             <button onClick={() => setMessage("")}>×</button>
//           </div>
//         )}

//         {/* Job form */}
//         <section className="rj-form-section">
//           <div className="rj-section-heading">
//             <div>
//               <h2>{editingId ? "Edit Job Posting" : "Create a New Job"}</h2>
//               <p>Fill in the details of the position you are hiring for.</p>
//             </div>
//           </div>

//           <form className="rj-form" onSubmit={handleSubmit}>
//             <div className="rj-form-grid">
//               <div className="rj-field rj-full">
//                 <label>Job Title</label>
//                 <input
//                   type="text"
//                   placeholder="e.g. Business Analyst"
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="rj-field rj-full">
//                 <label>Job Description</label>
//                 <textarea
//                   placeholder="Describe responsibilities, qualifications and role details..."
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={5}
//                   required
//                 />
//               </div>

//               <div className="rj-field rj-full">
//                 <label>Required Skills</label>
//                 <input
//                   type="text"
//                   placeholder="SQL, Excel, Communication, Agile..."
//                   value={requiredSkills}
//                   onChange={(e) => setRequiredSkills(e.target.value)}
//                   required
//                 />
//                 <small>Separate skills using commas.</small>
//               </div>

//               <div className="rj-field">
//                 <label>Required Experience (Years)</label>
//                 <input
//                   type="number"
//                   min="0"
//                   placeholder="0"
//                   value={experience}
//                   onChange={(e) => setExperience(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="rj-form-actions">
//               <button
//                 type="submit"
//                 className="rj-primary-btn"
//                 disabled={saving}
//               >
//                 {saving
//                   ? "Saving..."
//                   : editingId
//                   ? "Save Changes"
//                   : "+ Post Job"}
//               </button>

//               {editingId && (
//                 <button
//                   type="button"
//                   className="rj-secondary-btn"
//                   onClick={clearForm}
//                 >
//                   Cancel Editing
//                 </button>
//               )}
//             </div>
//           </form>
//         </section>

//         {/* Job listings */}
//         <section className="rj-job-section">
//           <div className="rj-section-heading rj-list-heading">
//             <div>
//               <h2>Your Job Postings</h2>
//               <p>Manage your jobs and see who applied.</p>
//             </div>

//             <span className="rj-job-total">
//               {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
//             </span>
//           </div>

//           {loading ? (
//             <div className="rj-empty">
//               <div className="rj-spinner"></div>
//               <p>Loading job postings...</p>
//             </div>
//           ) : jobs.length === 0 ? (
//             <div className="rj-empty">
//               <div className="rj-empty-icon">▤</div>
//               <h3>No job postings yet</h3>
//               <p>Create your first job posting using the form above.</p>
//             </div>
//           ) : (
//             <div className="rj-job-list">
//               {jobs.map((job) => {
//                 const jobApplicants = applicationsByJob[job.id] || [];
//                 const isExpanded = expandedJob === job.id;

//                 return (
//                   <article className="rj-job-card" key={job.id}>
//                     {/* Job information */}
//                     <div className="rj-job-top">
//                       <div className="rj-job-title-area">
//                         <div className="rj-job-icon">▤</div>

//                         <div>
//                           <h3>{job.title}</h3>
//                           <span className="rj-job-id">
//                             Job ID: #{job.id}
//                           </span>
//                         </div>
//                       </div>

//                       <span className="rj-experience">
//                         {job.experience === 0
//                           ? "Entry Level"
//                           : `${job.experience} Years Experience`}
//                       </span>
//                     </div>

//                     <div className="rj-skills">
//                       <strong>Required Skills</strong>
//                       <div className="rj-skill-tags">
//                         {(job.requiredSkills || "")
//                           .split(",")
//                           .filter(Boolean)
//                           .map((skill, index) => (
//                             <span key={index}>
//                               {skill.trim()}
//                             </span>
//                           ))}
//                       </div>
//                     </div>

//                     <div className="rj-description">
//                       <strong>Description</strong>
//                       <p>{job.description}</p>
//                     </div>

//                     {/* Job actions */}
//                     <div className="rj-job-actions">
//                       <button
//                         className="rj-applicant-btn"
//                         onClick={() => toggleApplicants(job.id)}
//                       >
//                         ♙ {jobApplicants.length}{" "}
//                         {jobApplicants.length === 1
//                           ? "Applicant"
//                           : "Applicants"}
//                         <span>
//                           {isExpanded ? "▲ Hide" : "▼ View"}
//                         </span>
//                       </button>

//                       <button
//                         className="rj-edit-btn"
//                         onClick={() => handleEdit(job)}
//                       >
//                         ✎ Edit
//                       </button>

//                       <button
//                         className="rj-delete-btn"
//                         onClick={() => handleDelete(job.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>

//                     {/* Applicant section */}
//                     {isExpanded && (
//                       <div className="rj-applicant-section">
//                         <div className="rj-applicant-heading">
//                           <div>
//                             <h3>Applicants</h3>
//                             <p>
//                               Candidates who applied for{" "}
//                               <strong>{job.title}</strong>
//                             </p>
//                           </div>

//                           <span className="rj-applicant-count">
//                             {jobApplicants.length}
//                           </span>
//                         </div>

//                         {jobApplicants.length === 0 ? (
//                           <div className="rj-no-applicants">
//                             <div>♙</div>
//                             <h4>No applicants yet</h4>
//                             <p>
//                               Applicants will appear here when
//                               candidates apply for this job.
//                             </p>
//                           </div>
//                         ) : (
//                           <div className="rj-applicant-list">
//                             {jobApplicants.map((app) => (
//                               <div
//                                 className="rj-applicant-card"
//                                 key={app.id}
//                               >
//                                 <div className="rj-applicant-main">
//                                   <div className="rj-candidate-avatar">
//                                     C
//                                   </div>

//                                   <div className="rj-candidate-info">
//                                     <h4>
//                                       Candidate #{app.candidateId}
//                                     </h4>
//                                     <span>
//                                       Application #{app.id}
//                                     </span>
//                                   </div>
//                                 </div>

//                                 <div className="rj-applicant-details">
//                                   <div>
//                                     <span>Resume ID</span>
//                                     <strong>
//                                       #{app.resumeId}
//                                     </strong>
//                                   </div>

//                                   <div>
//                                     <span>Match Score</span>
//                                     <strong className="rj-score">
//                                       {Number(
//                                         app.matchScore || 0
//                                       ).toFixed(0)}
//                                       %
//                                     </strong>
//                                   </div>
//                                 </div>

//                                 <div className="rj-status-area">
//                                   <label>Application Status</label>

//                                   <select
//                                     className={`rj-status-select rj-status-${(
//                                       app.status || "Applied"
//                                     )
//                                       .toLowerCase()
//                                       .replace(/\s+/g, "-")}`}
//                                     value={app.status || "Applied"}
//                                     onChange={(e) =>
//                                       handleStatusChange(
//                                         app.id,
//                                         e.target.value
//                                       )
//                                     }
//                                   >
//                                     <option value="Applied">
//                                       Applied
//                                     </option>
//                                     <option value="Shortlisted">
//                                       Shortlisted
//                                     </option>
//                                     <option value="Rejected">
//                                       Rejected
//                                     </option>
//                                     <option value="Hired">
//                                       Hired
//                                     </option>
//                                   </select>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </article>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/JobsPage.css";

export default function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        api.get("/api/jobs/my-jobs"),
        api.get("/api/applications/recruiter/my-applications"),
      ]);

      setJobs(jobsResponse.data || []);
      setApplications(applicationsResponse.data || []);
      setMessage("");
    } catch (error) {
      console.error("Loading recruiter data failed:", error);
      setMessage(
        error.response?.status === 403
          ? "Access denied. Please login as a recruiter."
          : "Unable to load jobs or applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applicationsByJob = useMemo(() => {
    const grouped = {};
    applications.forEach((app) => {
      if (!grouped[app.jobId]) grouped[app.jobId] = [];
      grouped[app.jobId].push(app);
    });
    return grouped;
  }, [applications]);

  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;
  const hiredCount = applications.filter(
    (app) => app.status?.toLowerCase() === "hired"
  ).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const jobData = {
        title,
        description,
        requiredSkills,
        experience: Number(experience),
      };

      if (editingId) {
        await api.put(`/api/jobs/${editingId}`, jobData);
        setMessage("Job updated successfully!");
      } else {
        await api.post("/api/jobs", jobData);
        setMessage("Job posted successfully!");
      }

      clearForm();
      await loadData();
    } catch (error) {
      console.error("Job save failed:", error);
      setMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Unable to save job."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setTitle(job.title || "");
    setDescription(job.description || "");
    setRequiredSkills(job.requiredSkills || "");
    setExperience(job.experience ?? "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await api.delete(`/api/jobs/${id}`);
      setMessage("Job deleted successfully!");
      setExpandedJob(null);
      await loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      setMessage("Unable to delete job.");
    }
  };

  const handleStatusChange = async (applicationId, status) => {
    try {
      await api.put(
        `/api/applications/status/${applicationId}`,
        null,
        { params: { status } }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status } : app
        )
      );
      setMessage("Applicant status updated!");
    } catch (error) {
      console.error("Status update failed:", error);
      setMessage("Unable to update applicant status.");
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setRequiredSkills("");
    setExperience("");
    setEditingId(null);
  };

  const toggleApplicants = (jobId) => {
    setExpandedJob((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <div className="jp-page">
      <header className="jp-topbar">
        <div className="jp-brand">
          <div className="jp-logo">S</div>
          <div>
            <h2>SmartRecruit AI</h2>
            <span>Recruiter Workspace</span>
          </div>
        </div>

        <button
          className="jp-back-btn"
          onClick={() => navigate("/recruiter/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="jp-container">
        <section className="jp-hero">
          <div className="jp-hero-content">
            <span className="jp-eyebrow">RECRUITER WORKSPACE</span>
            <h1>Manage your hiring</h1>
            <p>
              Create opportunities, discover talented candidates
              and manage your recruitment process.
            </p>
          </div>
          <div className="jp-hero-decoration">
            <span>✦</span>
            <span>✧</span>
            <span>♙</span>
          </div>
        </section>

        <section className="jp-stats">
          <div className="jp-stat-card">
            <div className="jp-stat-icon jp-purple">▤</div>
            <div>
              <span>Job Postings</span>
              <h2>{jobs.length}</h2>
            </div>
          </div>

          <div className="jp-stat-card">
            <div className="jp-stat-icon jp-blue">♙</div>
            <div>
              <span>Total Applicants</span>
              <h2>{totalApplicants}</h2>
            </div>
          </div>

          <div className="jp-stat-card">
            <div className="jp-stat-icon jp-green">✓</div>
            <div>
              <span>Shortlisted</span>
              <h2>{shortlistedCount}</h2>
            </div>
          </div>

          <div className="jp-stat-card">
            <div className="jp-stat-icon jp-orange">★</div>
            <div>
              <span>Hired</span>
              <h2>{hiredCount}</h2>
            </div>
          </div>
        </section>

        {message && (
          <div className="jp-message">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="jp-form-section">
          <div className="jp-section-heading">
            <div className="jp-heading-icon">✦</div>
            <div>
              <h2>{editingId ? "Update Job" : "Create a New Job"}</h2>
              <p>
                {editingId
                  ? "Modify your job posting details."
                  : "Share an opportunity with potential candidates."}
              </p>
            </div>
          </div>

          <form className="jp-form" onSubmit={handleSubmit}>
            <div className="jp-form-grid">
              <div className="jp-field jp-full">
                <label>Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Java Full Stack Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="jp-field jp-full">
                <label>Job Description</label>
                <textarea
                  placeholder="Describe responsibilities, qualifications and role details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div className="jp-field jp-full">
                <label>Required Skills</label>
                <input
                  type="text"
                  placeholder="Java, Spring Boot, React, MySQL..."
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  required
                />
                <small>Separate skills using commas.</small>
              </div>

              <div className="jp-field">
                <label>Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="jp-form-actions">
              <button className="jp-primary-btn" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "＋ Post Job"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="jp-cancel-btn"
                  onClick={clearForm}
                >
                  Cancel Editing
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="jp-job-section">
          <div className="jp-list-heading">
            <div>
              <span className="jp-eyebrow">YOUR WORKSPACE</span>
              <h2>Your Job Postings</h2>
              <p>Track job openings and manage candidate applications.</p>
            </div>
            <span className="jp-job-total">
              {jobs.length} {jobs.length === 1 ? "Job" : "Jobs"}
            </span>
          </div>

          {loading ? (
            <div className="jp-empty">
              <div className="jp-spinner"></div>
              <p>Loading job postings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="jp-empty">
              <div className="jp-empty-icon">▤</div>
              <h3>No job postings yet</h3>
              <p>Create your first job posting using the form above.</p>
            </div>
          ) : (
            <div className="jp-job-list">
              {jobs.map((job) => {
                const jobApplicants = applicationsByJob[job.id] || [];
                const isExpanded = expandedJob === job.id;

                return (
                  <article className="jp-job-card" key={job.id}>
                    <div className="jp-job-top">
                      <div className="jp-job-title-area">
                        <div className="jp-job-icon">▤</div>
                        <div>
                          <h3>{job.title}</h3>
                          <span>Job ID #{job.id}</span>
                        </div>
                      </div>

                      <span className="jp-experience">
                        {job.experience === 0
                          ? "Entry Level"
                          : `${job.experience} Years Experience`}
                      </span>
                    </div>

                    <div className="jp-description">
                      <p>{job.description}</p>
                    </div>

                    <div className="jp-skills">
                      <strong>Required Skills</strong>
                      <div className="jp-skill-tags">
                        {(job.requiredSkills || "")
                          .split(",")
                          .filter(Boolean)
                          .map((skill, index) => (
                            <span key={index}>{skill.trim()}</span>
                          ))}
                      </div>
                    </div>

                    <div className="jp-job-actions">
                      <button
                        className="jp-applicant-btn"
                        onClick={() => toggleApplicants(job.id)}
                      >
                        ♙ {jobApplicants.length} Applicants
                        <span>{isExpanded ? "▲ Hide" : "▼ View"}</span>
                      </button>

                      <button
                        className="jp-edit-btn"
                        onClick={() => handleEdit(job)}
                      >
                        ✎ Edit
                      </button>

                      <button
                        className="jp-delete-btn"
                        onClick={() => handleDelete(job.id)}
                      >
                        ✕ Delete
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="jp-applicant-section">
                        <div className="jp-applicant-heading">
                          <div>
                            <h3>Applicants</h3>
                            <p>
                              Candidates for <strong>{job.title}</strong>
                            </p>
                          </div>
                          <span className="jp-applicant-count">
                            {jobApplicants.length}
                          </span>
                        </div>

                        {jobApplicants.length === 0 ? (
                          <div className="jp-no-applicants">
                            <div>♙</div>
                            <h4>No applicants yet</h4>
                            <p>
                              Candidate applications will appear
                              here when they apply.
                            </p>
                          </div>
                        ) : (
                          <div className="jp-applicant-list">
                            {jobApplicants.map((app) => (
                              <div className="jp-applicant-card" key={app.id}>
                                <div className="jp-applicant-main">
                                  <div className="jp-avatar">C</div>
                                  <div className="jp-candidate-info">
                                    <h4>Candidate #{app.candidateId}</h4>
                                    <span>Application #{app.id}</span>
                                  </div>
                                </div>

                                <div className="jp-applicant-details">
                                  <div>
                                    <span>Resume</span>
                                    <strong>#{app.resumeId}</strong>
                                  </div>
                                  <div>
                                    <span>Match Score</span>
                                    <strong className="jp-score">
                                      {Number(app.matchScore || 0).toFixed(0)}%
                                    </strong>
                                  </div>
                                </div>

                                <div className="jp-status-area">
                                  <label>Status</label>
                                  <select
                                    className="jp-status-select"
                                    value={app.status || "Applied"}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        app.id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="Applied">Applied</option>
                                    <option value="Shortlisted">
                                      Shortlisted
                                    </option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Hired">Hired</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
