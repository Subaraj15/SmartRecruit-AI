import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/Applications.css";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const base64Payload = token
        .split(".")[1]
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(atob(base64Payload));
      const candidateId = Number(payload.id);

      if (!Number.isInteger(candidateId) || candidateId <= 0) {
        throw new Error("Candidate ID not found. Please log in again.");
      }

      const res = await api.get(
        `/api/applications/candidate/${candidateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(
        Array.isArray(res.data) ? res.data : []
      );
    } catch (error) {
      console.error(
        "Unable to load applications:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        setMessage("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setMessage("Access denied. Please check your login permissions.");
      } else {
        setMessage(
          error.response?.data?.message ||
          error.message ||
          "Unable to load applications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ap-page">

      {/* Navbar */}
      <nav className="ap-navbar">
        <h2>
          SmartRecruit <span>AI</span>
        </h2>

        <button
          className="ap-nav-button"
          onClick={() => navigate("/candidate/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      {/* Main content */}
      <main className="ap-content">

        <div className="ap-heading-section">
          <div>
            <p className="ap-eyebrow">CANDIDATE PORTAL</p>
            <h1>My Applications</h1>
            <p className="ap-subtitle">
              Track your job applications and resume match scores.
            </p>
          </div>

          {!loading && !message && (
            <div className="ap-count">
              <span>{applications.length}</span>
              <small>Applications</small>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="ap-state">
            <div className="ap-loader"></div>
            <p>Loading your applications...</p>
          </div>
        )}

        {/* Error */}
        {!loading && message && (
          <div className="ap-state ap-error">
            <h3>Unable to load applications</h3>
            <p>{message}</p>

            <button onClick={loadApplications}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !message && applications.length === 0 && (
          <div className="ap-empty">
            <div className="ap-empty-icon">📂</div>
            <h2>No applications yet</h2>
            <p>
              Explore available jobs and submit your resume
              to start tracking your applications here.
            </p>

            <button
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse Jobs
            </button>
          </div>
        )}

        {/* Application cards */}
        {!loading && !message && applications.length > 0 && (
          <div className="ap-grid">

            {applications.map((app) => {
              const score = Number(app.matchScore);
              const validScore = Number.isFinite(score);

              return (
                <div className="ap-card" key={app.id}>

                  <div className="ap-card-top">
                    <div className="ap-job-icon">
                      💼
                    </div>

                    <span className="ap-status">
                      <span className="ap-status-dot"></span>
                      {app.status || "Applied"}
                    </span>
                  </div>

                  <h3>Job #{app.jobId}</h3>

                  <p className="ap-card-description">
                    Your application has been submitted
                    for this job.
                  </p>

                  <div className="ap-score-section">
                    <div className="ap-score-heading">
                      <span>Resume Match Score</span>

                      <strong>
                        {validScore
                          ? `${score.toFixed(2)}%`
                          : "N/A"}
                      </strong>
                    </div>

                    <div className="ap-progress-track">
                      <div
                        className="ap-progress-fill"
                        style={{
                          width: `${
                            validScore
                              ? Math.min(Math.max(score, 0), 100)
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="ap-card-details">

                    <div className="ap-detail">
                      <span>Application ID</span>
                      <strong>{app.id}</strong>
                    </div>

                    <div className="ap-detail">
                      <span>Resume ID</span>
                      <strong>{app.resumeId}</strong>
                    </div>

                  </div>

                  <div className="ap-card-footer">
                    <span>Application Status</span>
                    <strong>{app.status || "Applied"}</strong>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}
