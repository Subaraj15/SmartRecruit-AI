import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../api";
import "../CSS/RecruiterDashboard.css";

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      // const res = await axios.get(
      //   "http://localhost:8080/api/applications/recruiter/my-applications",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const res = await api.get("/api/applications/recruiter/my-applications");

      setApplications(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch recruiter applications:", err);
      setError("Unable to load recruitment statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalApplications = applications.length;

  const shortlisted = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;

  const pending = applications.filter(
    (app) => app.status?.toLowerCase() === "applied"
  ).length;

  const selected = applications.filter(
    (app) => app.status?.toLowerCase() === "selected"
  ).length;

  const uniqueJobs = new Set(
    applications.map((app) => app.jobId)
  ).size;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="rd-layout">

      {/* SIDEBAR */}
      <aside className="rd-sidebar">

        <div className="rd-brand">
          <div className="rd-brand-icon">S</div>
          <div className="rd-brand-text">
            SmartRecruit <span>AI</span>
          </div>
        </div>

        <div className="rd-sidebar-label">WORKSPACE</div>

        <nav className="rd-nav">

          <button className="rd-nav-item active">
            <span className="rd-nav-icon">▦</span>
            Dashboard
          </button>

          <button
            className="rd-nav-item"
            onClick={() => navigate("/recruiter/jobs")}
          >
            <span className="rd-nav-icon">▤</span>
            Manage Jobs
          </button>

          <button
            className="rd-nav-item"
            onClick={() => navigate("/recruiter/applicants")}
          >
            <span className="rd-nav-icon">♙</span>
            Applicants
          </button>

        </nav>

        <div className="rd-sidebar-bottom">

          <div className="rd-sidebar-note">
            <div className="rd-note-icon">✦</div>
            <h4>Smart hiring starts here</h4>
            <p>
              Manage your job openings and find the right talent.
            </p>
          </div>

          <button className="rd-logout" onClick={logout}>
            <span>↪</span> Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="rd-main">

        {/* HEADER */}
        <header className="rd-header">

          <div>
            <div className="rd-header-eyebrow">
              RECRUITER WORKSPACE
            </div>

            <h1>Dashboard</h1>

            <p>
              Welcome to your recruitment workspace.
            </p>
          </div>

          <div className="rd-header-right">

            <button
              className="rd-refresh"
              onClick={() => {
                setLoading(true);
                fetchApplications();
              }}
            >
              <span>↻</span> Refresh
            </button>

            <div className="rd-profile">
              <div className="rd-avatar">R</div>
              <div className="rd-profile-text">
                <strong>Recruiter</strong>
                <span>Workspace</span>
              </div>
            </div>

          </div>

        </header>

        {/* WELCOME */}
        <section className="rd-welcome">

          <div className="rd-welcome-content">

            <div className="rd-welcome-label">
              ✦ SMARTRECRUIT AI
            </div>

            <h2>
              Hire smarter.<br />
              Find the perfect talent.
            </h2>

            <p>
              Track applications, discover talented candidates
              and manage your recruitment journey all in one place.
            </p>

            <button
              className="rd-welcome-button"
              onClick={() => navigate("/recruiter/jobs")}
            >
              Explore Your Jobs <span>→</span>
            </button>

          </div>

          <div className="rd-welcome-art">
            <div className="rd-art-circle rd-art-circle-one"></div>
            <div className="rd-art-circle rd-art-circle-two"></div>

            <div className="rd-art-card">
              <div className="rd-art-card-top">
                <span>✦</span>
                <span>AI RECRUITMENT</span>
              </div>

              <div className="rd-art-main-icon">♙</div>

              <div className="rd-art-lines">
                <div></div>
                <div></div>
                <div></div>
              </div>

              <div className="rd-art-bottom">
                <span>Talent Discovery</span>
                <span className="rd-art-check">✓</span>
              </div>
            </div>

          </div>

        </section>

        {/* STATISTICS */}
        <section className="rd-section">

          <div className="rd-section-heading">
            <div>
              <h2>Recruitment Overview</h2>
              <p>Insights into your recruitment activities</p>
            </div>
          </div>

          {loading ? (
            <div className="rd-loading">
              <div className="rd-loader"></div>
              Loading recruitment statistics...
            </div>
          ) : error ? (
            <div className="rd-error">{error}</div>
          ) : (

            <div className="rd-stats-grid">

              {/* TOTAL APPLICATIONS */}
              <div className="rd-stat-card">
                <div className="rd-stat-top">
                  <div className="rd-stat-icon rd-purple">
                    ♙
                  </div>
                  <span className="rd-stat-tag">Applications</span>
                </div>

                <h3>{totalApplications}</h3>
                <p>Total Applications</p>
                <div className="rd-stat-footer">
                  <span className="rd-stat-dot purple-dot"></span>
                  Applications received for your jobs
                </div>
              </div>

              {/* SHORTLISTED */}
              <div className="rd-stat-card">
                <div className="rd-stat-top">
                  <div className="rd-stat-icon rd-blue">
                    ✓
                  </div>
                  <span className="rd-stat-tag">Shortlist</span>
                </div>

                <h3>{shortlisted}</h3>
                <p>Shortlisted Candidates</p>
                <div className="rd-stat-footer">
                  <span className="rd-stat-dot blue-dot"></span>
                  Candidates shortlisted for review
                </div>
              </div>

              {/* PENDING */}
              <div className="rd-stat-card">
                <div className="rd-stat-top">
                  <div className="rd-stat-icon rd-orange">
                    ◷
                  </div>
                  <span className="rd-stat-tag">Pending</span>
                </div>

                <h3>{pending}</h3>
                <p>Pending Review</p>
                <div className="rd-stat-footer">
                  <span className="rd-stat-dot orange-dot"></span>
                  Applications awaiting review
                </div>
              </div>

              {/* JOBS */}
              <div className="rd-stat-card">
                <div className="rd-stat-top">
                  <div className="rd-stat-icon rd-green">
                    ▤
                  </div>
                  <span className="rd-stat-tag">Jobs</span>
                </div>

                <h3>{uniqueJobs}</h3>
                <p>Jobs with Applicants</p>
                <div className="rd-stat-footer">
                  <span className="rd-stat-dot green-dot"></span>
                  Job postings receiving applications
                </div>
              </div>

            </div>

          )}

        </section>

        {/* QUICK ACTIONS */}
        <section className="rd-section">

          <div className="rd-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Get things done faster</p>
            </div>
          </div>

          <div className="rd-actions-grid">

            {/* MANAGE JOBS */}
            <div
              className="rd-action-card"
              onClick={() => navigate("/recruiter/jobs")}
            >

              <div className="rd-action-card-top">
                <div className="rd-action-icon rd-purple">
                  ▤
                </div>
                <span className="rd-action-arrow">↗</span>
              </div>

              <h3>Manage Job Postings</h3>

              <p>
                Create new job opportunities, edit existing
                postings and manage your vacancies.
              </p>

              <div className="rd-action-link">
                Go to Manage Jobs <span>→</span>
              </div>

            </div>

            {/* APPLICANTS */}
            <div
              className="rd-action-card"
              onClick={() => navigate("/recruiter/applicants")}
            >

              <div className="rd-action-card-top">
                <div className="rd-action-icon rd-blue">
                  ♙
                </div>
                <span className="rd-action-arrow">↗</span>
              </div>

              <h3>Review Applicants</h3>

              <p>
                Review candidate applications, compare match
                scores and shortlist suitable candidates.
              </p>

              <div className="rd-action-link">
                View Applicants <span>→</span>
              </div>

            </div>

            {/* SHORTLIST */}
            <div
              className="rd-action-card"
              onClick={() => navigate("/recruiter/applicants")}
            >

              <div className="rd-action-card-top">
                <div className="rd-action-icon rd-green">
                  ✓
                </div>
                <span className="rd-action-arrow">↗</span>
              </div>

              <h3>Shortlisted Candidates</h3>

              <p>
                Keep track of shortlisted candidates and
                manage your hiring decisions.
              </p>

              <div className="rd-action-link">
                View Shortlist <span>→</span>
              </div>

            </div>

          </div>

        </section>

        {/* BOTTOM SUMMARY */}
        {!loading && !error && (
          <section className="rd-bottom-summary">

            <div className="rd-bottom-summary-icon">✦</div>

            <div className="rd-bottom-summary-content">
              <h3>Your hiring progress</h3>
              <p>
                You have received {totalApplications} application
                {totalApplications !== 1 ? "s" : ""}, shortlisted{" "}
                {shortlisted} candidate{shortlisted !== 1 ? "s" : ""},
                and selected {selected} candidate
                {selected !== 1 ? "s" : ""}.
              </p>
            </div>

            <button
              onClick={() => navigate("/recruiter/applicants")}
            >
              Review Now →
            </button>

          </section>
        )}

        <footer className="rd-footer">
          <span>SmartRecruit AI</span>
          <span>Recruitment made smarter ✦</span>
        </footer>

      </main>

    </div>
  );
}
