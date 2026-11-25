import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";
import "../CSS/MatchResult.css";

export default function MatchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const jobId = params.get("jobId");
  const resumeId = params.get("resumeId");
  const score = Number(params.get("score"));

  const matchResult = location.state?.matchResult;

  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  const handleApply = async () => {
    if (applying) return;

    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setApplying(true);

      const base64Payload = token
        .split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(atob(base64Payload));
      const candidateId = Number(payload.id);

      if (!Number.isInteger(candidateId) || candidateId <= 0) {
        throw new Error("Candidate ID not found. Please log in again.");
      }

      // Submit application
      await api.post(
        "/api/applications/apply",
        null,
        {
          params: {
            candidateId,
            jobId: Number(jobId),
            resumeId: Number(resumeId),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Application submitted successfully!");
      navigate("/applications");

    } catch (error) {
      console.error(
        "Application error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Unable to submit application."
      );

    } finally {
      setApplying(false);
    }
  };

  const matchedSkills = matchResult?.matchedSkills
    ? String(matchResult.matchedSkills)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const missingSkills = matchResult?.missingSkills
    ? String(matchResult.missingSkills)
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  const validScore = Number.isFinite(score);
  const visualScore = validScore
    ? Math.min(Math.max(score, 0), 100)
    : 0;

  return (
    <div className="mr-page">

      {/* Navbar */}
      <nav className="mr-navbar">
        <h2>
          SmartRecruit <span>AI</span>
        </h2>

        <button
          className="mr-nav-button"
          onClick={() => navigate("/candidate/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      <main className="mr-content">

        {/* Heading */}
        <div className="mr-page-heading">
          <div className="mr-heading-icon">✨</div>

          <p className="mr-eyebrow">
            RESUME ANALYSIS
          </p>

          <h1>Resume Match Result</h1>

          <p className="mr-heading-description">
            Your resume has been analyzed against the job requirements.
          </p>

          <div className="mr-job-pill">
            <span>Job ID</span>
            <strong>#{jobId}</strong>
          </div>
        </div>

        {/* Main Score Card */}
        <section className="mr-score-card">

          <div className="mr-score-visual">

            {validScore ? (
              <div
                className="mr-score-ring"
                style={{
                  "--mr-score": `${visualScore}%`,
                }}
              >
                <div className="mr-score-inner">
                  <strong>{score.toFixed(2)}%</strong>
                  <span>Match Score</span>
                </div>
              </div>
            ) : (
              <div className="mr-invalid-score">
                N/A
              </div>
            )}

          </div>

          <div className="mr-score-text">
            <p className="mr-score-label">
              Resume Compatibility
            </p>

            <h2>
  {validScore
    ? (
        score >= 80
          ? "Excellent Match!"
          : score >= 60
          ? "Good Match!"
          : score >= 40
          ? "Moderate Match"
          : "Needs Improvement"
      )
    : "Score unavailable"}
</h2>

            <p>
              {validScore
                ? "See how your skills align with the requirements of this position."
                : "Please upload and analyze your resume again to calculate your match score."}
            </p>
          </div>

        </section>

        {/* Skills */}
        <section className="mr-skills-grid">

          {/* Matched Skills */}
          <div className="mr-skills-card mr-matched-card">
            <div className="mr-skills-header">
              <div className="mr-skills-icon mr-green-icon">
                ✓
              </div>

              <div>
                <h2>Matched Skills</h2>
                <p>Skills found in your resume</p>
              </div>
            </div>

            {matchedSkills.length > 0 ? (
              <div className="mr-skill-list">
                {matchedSkills.map((skill, index) => (
                  <span
                    className="mr-skill-tag mr-matched-tag"
                    key={`${skill}-${index}`}
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mr-no-skills">
                No matched skills returned.
              </div>
            )}
          </div>

          {/* Missing Skills */}
          <div className="mr-skills-card mr-missing-card">
            <div className="mr-skills-header">
              <div className="mr-skills-icon mr-orange-icon">
                +
              </div>

              <div>
                <h2>Missing Skills</h2>
                <p>Skills to consider learning</p>
              </div>
            </div>

            {missingSkills.length > 0 ? (
              <div className="mr-skill-list">
                {missingSkills.map((skill, index) => (
                  <span
                    className="mr-skill-tag mr-missing-tag"
                    key={`${skill}-${index}`}
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mr-no-skills">
                No missing skills reported.
              </div>
            )}
          </div>

        </section>

        {/* Information */}
        <section className="mr-summary-card">

          <h2>Analysis Summary</h2>

          <div className="mr-summary-grid">

            <div className="mr-summary-item">
              <span>Job ID</span>
              <strong>#{jobId || "N/A"}</strong>
            </div>

            <div className="mr-summary-item">
              <span>Resume ID</span>
              <strong>#{resumeId || "N/A"}</strong>
            </div>

            <div className="mr-summary-item">
              <span>Match Score</span>
              <strong>
                {validScore ? `${score.toFixed(2)}%` : "N/A"}
              </strong>
            </div>

            <div className="mr-summary-item">
              <span>Matched Skills</span>
              <strong>{matchedSkills.length}</strong>
            </div>

            <div className="mr-summary-item">
              <span>Missing Skills</span>
              <strong>{missingSkills.length}</strong>
            </div>

          </div>

        </section>

        {!matchResult && (
          <div className="mr-warning">
            Detailed skill information is unavailable. Please upload and
            analyze your resume again to view the complete result.
          </div>
        )}

        {/* Apply Section */}
        <section className="mr-apply-card">

          <div>
            <h2>Ready to apply?</h2>

            <p>
              Submit your application for this job using your analyzed resume.
            </p>
          </div>

          {message && (
            <div className="mr-error">
              {message}
            </div>
          )}

          <div className="mr-action-buttons">

            <button
              className="mr-apply-button"
              onClick={handleApply}
              disabled={
                applying ||
                !matchResult ||
                !validScore ||
                !jobId ||
                !resumeId
              }
            >
              {applying
                ? "Submitting Application..."
                : "Apply Now →"}
            </button>

            <button
              className="mr-secondary-button"
              onClick={() => navigate("/applications")}
            >
              View My Applications
            </button>

          </div>

        </section>

      </main>
    </div>
  );
}

