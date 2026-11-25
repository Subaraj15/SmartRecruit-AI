
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import "../CSS/JobDetails.css";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data);
        setMessage("");
      } catch (error) {
        console.error("Unable to load job:", error);
        setMessage("Unable to load job.");
      }
    };

    loadJob();
  }, [id]);

  const handleApply = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    navigate(`/resume?jobId=${id}`);
  };

  if (!job) {
    return (
      <div className="jd-page">
        <nav className="jd-navbar">
          <h2 className="jd-logo">
            SmartRecruit <span>AI</span>
          </h2>
        </nav>

        <div className="jd-loading">
          <div className="jd-loading-spinner"></div>
          <p>{message || "Loading job details..."}</p>
        </div>
      </div>
    );
  }

  const skills = job.requiredSkills
    ? job.requiredSkills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  return (
    <div className="jd-page">

      {/* NAVBAR */}
      <nav className="jd-navbar">
        <h2 className="jd-logo">
          SmartRecruit <span>AI</span>
        </h2>

        <button
          className="jd-back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>
      </nav>

      {/* PAGE CONTENT */}
      <main className="jd-main">

        {/* BREADCRUMB */}
        <div className="jd-breadcrumb">
          <span onClick={() => navigate("/jobs")}>Jobs</span>
          <span className="jd-breadcrumb-arrow">/</span>
          <span>Job Details</span>
        </div>

        {/* JOB CARD */}
        <section className="jd-card">

          {/* TOP HEADER */}
          <div className="jd-top-section">

            <div className="jd-job-icon">
              <span>💼</span>
            </div>

            <div className="jd-title-content">
              <div className="jd-open-badge">
                <span className="jd-status-dot"></span>
                Open Position
              </div>

              <h1 className="jd-heading">{job.title}</h1>

              <p className="jd-subtitle">
                Explore this opportunity and see how your skills match the role.
              </p>
            </div>

          </div>

          {/* JOB QUICK INFO */}
          <div className="jd-info-grid">

            <div className="jd-info-box">
              <div className="jd-info-icon">💼</div>
              <div>
                <span className="jd-info-label">Experience</span>
                <h3>
                  {job.experience} {job.experience === 1 ? "Year" : "Years"}
                </h3>
              </div>
            </div>

            <div className="jd-info-box">
              <div className="jd-info-icon">⚡</div>
              <div>
                <span className="jd-info-label">Required Skills</span>
                <h3>{skills.length} Skills</h3>
              </div>
            </div>

            <div className="jd-info-box">
              <div className="jd-info-icon">🎯</div>
              <div>
                <span className="jd-info-label">Job Type</span>
                <h3>Career Opportunity</h3>
              </div>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="jd-section">

            <div className="jd-section-heading">
              <span className="jd-heading-icon">📋</span>
              <h2>About the Role</h2>
            </div>

            <p className="jd-description">
              {job.description}
            </p>

          </div>

          {/* SKILLS */}
          <div className="jd-section">

            <div className="jd-section-heading">
              <span className="jd-heading-icon">⚙️</span>
              <h2>Required Skills</h2>
            </div>

            {skills.length > 0 ? (
              <div className="jd-skills">
                {skills.map((skill, index) => (
                  <span className="jd-skill-tag" key={index}>
                    <span className="jd-skill-check">✓</span>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="jd-no-skills">No skills specified.</p>
            )}

          </div>

          {/* EXPERIENCE */}
          <div className="jd-section">

            <div className="jd-section-heading">
              <span className="jd-heading-icon">📈</span>
              <h2>Experience Requirements</h2>
            </div>

            <div className="jd-experience-card">
              <div className="jd-experience-icon">💼</div>

              <div>
                <h3>
                  {job.experience} {job.experience === 1 ? "Year" : "Years"} of Experience
                </h3>
                <p>Required experience for this position</p>
              </div>
            </div>

          </div>

          {/* APPLY SECTION */}
          <div className="jd-apply-section">

            <div className="jd-apply-text">
              <h2>Ready to take the next step?</h2>
              <p>Upload your resume and discover your job match score.</p>
            </div>

            <button
              className="jd-apply-button"
              onClick={handleApply}
            >
              Apply for this Job <span>→</span>
            </button>

          </div>

          {message && (
            <p className="jd-error">{message}</p>
          )}

        </section>

        {/* FOOTER NOTE */}
        <div className="jd-footer-note">
          <span>🔒</span>
          Your resume and application details are handled securely.
        </div>

      </main>

    </div>
  );
}
