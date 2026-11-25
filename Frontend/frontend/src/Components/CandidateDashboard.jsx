import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/CandidateDashboard.css";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  // const loadApplications = async () => {
  //   try {
  //     const res = await api.get("/api/applications/getall");
  //     setApplications(Array.isArray(res.data) ? res.data : []);
  //   } catch (error) {
  //     console.error(
  //       "Applications error:",
  //       error.response?.status || error.message
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const loadApplications = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      setApplications([]);
      return;
    }

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const candidateId =
      payload.id || payload.userId || payload.candidateId;

    if (!candidateId) {
      console.error("Candidate ID not found in token");
      setApplications([]);
      return;
    }

    const res = await api.get(
      `/api/applications/candidate/${candidateId}`
    );

    setApplications(
      Array.isArray(res.data) ? res.data : []
    );

  } catch (error) {
    console.error("Applications error:", error);
  } finally {
    setLoading(false);
  }
}; 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const shortlisted = applications.filter(
    (app) => app.status?.toUpperCase() === "SHORTLISTED"
  ).length;

  const pending = applications.filter((app) => {
    const status = app.status?.toUpperCase();
    return status === "APPLIED" || status === "PENDING";
  }).length;

  const rejected = applications.filter(
    (app) => app.status?.toUpperCase() === "REJECTED"
  ).length;

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "SHORTLISTED":
        return "cd-status-shortlisted";
      case "REJECTED":
        return "cd-status-rejected";
      case "ACCEPTED":
        return "cd-status-accepted";
      case "PENDING":
        return "cd-status-pending";
      default:
        return "cd-status-applied";
    }
  };

  return (
    <div className="cd-layout">

      {/* SIDEBAR */}
      <aside className="cd-sidebar">

        <div className="cd-brand">
          <div className="cd-brand-logo">S</div>
          <span>SmartRecruit <span className="cd-brand-ai">AI</span></span>
        </div>

        <div className="cd-sidebar-label">MENU</div>

        <nav className="cd-nav">

          <button className="cd-nav-item active">
            <span>◫</span>
            Dashboard
          </button>

          <button
            className="cd-nav-item"
            onClick={() => navigate("/jobs")}
          >
            <span>⌕</span>
            Browse Jobs
          </button>

          <button
            className="cd-nav-item"
            onClick={() => navigate("/applications")}
          >
            <span>▤</span>
            My Applications
          </button>

          <button
            className="cd-nav-item"
            onClick={() => navigate("/resume")}
          >
            <span>▧</span>
            My Resume
          </button>

          <button
            className="cd-nav-item"
            onClick={() => navigate("/ai-jobs")}
          >
            <span>✦</span>
            AI Job Assistant
          </button>

        </nav>

        <div className="cd-sidebar-bottom">

          <div className="cd-help-card">
            <div className="cd-help-icon">✦</div>
            <h4>Need help finding a job?</h4>
            <p>Explore jobs that match your skills.</p>
            <button onClick={() => navigate("/jobs")}>
              Explore Jobs →
            </button>
          </div>

          <button className="cd-nav-item cd-logout" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="cd-main">

        {/* TOP BAR */}
        <header className="cd-topbar">
          <div>
            <span className="cd-topbar-label">Candidate Portal</span>
          </div>

          <div className="cd-topbar-right">
            <div className="cd-avatar">C</div>
            <div className="cd-user-info">
              <strong>Candidate</strong>
              <span>Job seeker</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="cd-content">

          {/* WELCOME */}
          <section className="cd-welcome">

            <div className="cd-welcome-text">
              <span className="cd-welcome-tag">YOUR CAREER SPACE</span>

              <h1>Welcome back! 👋</h1>

              <p>
                Discover opportunities, match your resume and take
                the next step in your career.
              </p>

              <button
                className="cd-primary-btn"
                onClick={() => navigate("/jobs")}
              >
                Explore Jobs <span>→</span>
              </button>
            </div>

            <div className="cd-welcome-art">
              <div className="cd-art-circle">
                <div className="cd-art-document">
                  <div className="cd-art-doc-icon">📄</div>
                  <div className="cd-art-line long"></div>
                  <div className="cd-art-line"></div>
                  <div className="cd-art-line short"></div>
                  <div className="cd-art-match">✦ AI Match</div>
                </div>
              </div>
              <div className="cd-art-sparkle sparkle-one">✦</div>
              <div className="cd-art-sparkle sparkle-two">✧</div>
            </div>

          </section>

          {/* STATS */}
          <section className="cd-stats-section">

            <div className="cd-section-heading">
              <div>
                <h2>Application Overview</h2>
                <p>Track your job application progress.</p>
              </div>
            </div>

            <div className="cd-stats-grid">

              <div className="cd-stat-card">
                <div className="cd-stat-top">
                  <span className="cd-stat-icon purple">▤</span>
                  <span className="cd-stat-caption">Total</span>
                </div>
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-top">
                  <span className="cd-stat-icon green">✓</span>
                  <span className="cd-stat-caption">Progress</span>
                </div>
                <h3>{shortlisted}</h3>
                <p>Shortlisted</p>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-top">
                  <span className="cd-stat-icon orange">◷</span>
                  <span className="cd-stat-caption">Active</span>
                </div>
                <h3>{pending}</h3>
                <p>Awaiting Response</p>
              </div>

              <div className="cd-stat-card">
                <div className="cd-stat-top">
                  <span className="cd-stat-icon red">×</span>
                  <span className="cd-stat-caption">Status</span>
                </div>
                <h3>{rejected}</h3>
                <p>Rejected</p>
              </div>

            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="cd-quick-section">

            <div className="cd-section-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Everything you need for your job search.</p>
              </div>
            </div>

            <div className="cd-quick-grid">

              <button
                className="cd-quick-card"
                onClick={() => navigate("/jobs")}
              >
                <div className="cd-quick-icon purple">⌕</div>
                <div>
                  <h3>Find Jobs</h3>
                  <p>Explore new opportunities</p>
                </div>
                <span className="cd-quick-arrow">→</span>
              </button>

              <button
                className="cd-quick-card"
                onClick={() => navigate("/resume")}
              >
                <div className="cd-quick-icon blue">▧</div>
                <div>
                  <h3>Upload Resume</h3>
                  <p>Analyze your skill match</p>
                </div>
                <span className="cd-quick-arrow">→</span>
              </button>

              <button
                className="cd-quick-card"
                onClick={() => navigate("/applications")}
              >
                <div className="cd-quick-icon green">▤</div>
                <div>
                  <h3>Applications</h3>
                  <p>Track your progress</p>
                </div>
                <span className="cd-quick-arrow">→</span>
              </button>

            </div>

          </section>

          {/* RECENT APPLICATIONS */}
          <section className="cd-recent-section">

            <div className="cd-section-heading cd-recent-heading">
              <div>
                <h2>Recent Applications</h2>
                <p>Your latest job application activity.</p>
              </div>

              <button
                className="cd-view-all"
                onClick={() => navigate("/applications")}
              >
                View All →
              </button>
            </div>

            {loading ? (
              <div className="cd-empty">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="cd-empty">
                <div className="cd-empty-icon">▤</div>
                <h3>No applications yet</h3>
                <p>
                  Start exploring jobs and apply for opportunities
                  that match your skills.
                </p>
                <button
                  className="cd-primary-btn"
                  onClick={() => navigate("/jobs")}
                >
                  Browse Jobs →
                </button>
              </div>
            ) : (
              <div className="cd-application-list">

                {applications.slice(0, 5).map((app) => (
                  <div className="cd-application-row" key={app.id}>

                    <div className="cd-job-icon">
                      💼
                    </div>

                    <div className="cd-application-info">
                      <h3>Job #{app.jobId}</h3>
                      <span>Application #{app.id}</span>
                    </div>

                    <div className="cd-match-info">
                      <strong>{app.matchScore ?? 0}%</strong>
                      <span>Match score</span>
                    </div>

                    <div className="cd-application-status">
                      <span className={`cd-status ${getStatusClass(app.status)}`}>
                        {app.status || "Applied"}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>

          {/* FOOTER */}
          <footer className="cd-footer">
            <span>© 2026 SmartRecruit AI</span>
            <span>Built to help you find your next opportunity.</span>
          </footer>

        </div>
      </main>
    </div>
  );
}
