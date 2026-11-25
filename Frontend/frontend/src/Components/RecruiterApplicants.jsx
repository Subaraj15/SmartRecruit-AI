import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/RecruiterApplicants.css";

export default function RecruiterApplicants() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/api/applications/recruiter/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(res.data || []);
      setMessage("");
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
      setMessage("Unable to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/applications/status/${id}?status=${encodeURIComponent(status)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Unique job IDs
  const jobIds = useMemo(() => {
    return [...new Set(applications.map((app) => app.jobId))]
      .filter((id) => id !== undefined && id !== null)
      .sort((a, b) => Number(a) - Number(b));
  }, [applications]);

  // Statistics
  const totalApplicants = applications.length;

  const shortlistedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "shortlisted"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status?.toLowerCase() === "rejected"
  ).length;

  const hiredCount = applications.filter(
    (app) =>
      ["hired", "selected"].includes(app.status?.toLowerCase())
  ).length;

  // Search and filters
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        String(app.candidateId ?? "").toLowerCase().includes(search) ||
        String(app.id ?? "").toLowerCase().includes(search) ||
        String(app.jobId ?? "").toLowerCase().includes(search) ||
        String(app.resumeId ?? "").toLowerCase().includes(search);

      const matchesJob =
        jobFilter === "all" ||
        String(app.jobId) === String(jobFilter);

      const matchesStatus =
        statusFilter === "all" ||
        app.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesJob && matchesStatus;
    });
  }, [applications, searchTerm, jobFilter, statusFilter]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
        return "ra-status-shortlisted";
      case "rejected":
        return "ra-status-rejected";
      case "hired":
      case "selected":
        return "ra-status-hired";
      default:
        return "ra-status-applied";
    }
  };

  const getInitials = (candidateId) => {
    return String(candidateId ?? "C").slice(-2).toUpperCase();
  };

  return (
    <div className="ra-page">
      {/* Background glows */}
      <div className="ra-glow ra-glow-one"></div>
      <div className="ra-glow ra-glow-two"></div>
      <div className="ra-glow ra-glow-three"></div>

      {/* Navbar */}
      <header className="ra-navbar">
        <div className="ra-navbar-inner">
          <div className="ra-brand">
            <div className="ra-brand-icon">
              <span>✦</span>
            </div>
            <span>
              SmartRecruit <strong>AI</strong>
            </span>
          </div>

          <nav className="ra-nav-links">
            <button
              className="ra-nav-item"
              onClick={() => navigate("/recruiter/dashboard")}
            >
              <span>⌂</span> Dashboard
            </button>

            <button
              className="ra-nav-item"
              onClick={() => navigate("/recruiter/jobs")}
            >
              <span>▣</span> My Jobs
            </button>

            <button className="ra-nav-item ra-nav-active">
              <span>♙</span> Applicants
            </button>
          </nav>

          <div className="ra-profile">
            <div className="ra-profile-avatar">R</div>
            <span>Recruiter</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="ra-container">
        {/* Heading */}
        <section className="ra-hero">
          <div className="ra-hero-label">
            <span className="ra-label-icon">✦</span>
            Recruiter Workspace
          </div>

          <h1>Applicants</h1>

          <p>
            Review and manage candidates who applied to your jobs.
          </p>

          <div className="ra-heading-line"></div>
        </section>

        {/* Statistics */}
        <section className="ra-stats-grid">
          <div className="ra-stat-card ra-stat-purple">
            <div className="ra-stat-icon">♙</div>
            <div className="ra-stat-content">
              <span>Total Applicants</span>
              <h2>{totalApplicants}</h2>
            </div>
            <div className="ra-stat-decoration"></div>
          </div>

          <div className="ra-stat-card ra-stat-green">
            <div className="ra-stat-icon">✓</div>
            <div className="ra-stat-content">
              <span>Shortlisted</span>
              <h2>{shortlistedCount}</h2>
            </div>
            <div className="ra-stat-decoration"></div>
          </div>

          <div className="ra-stat-card ra-stat-red">
            <div className="ra-stat-icon">×</div>
            <div className="ra-stat-content">
              <span>Rejected</span>
              <h2>{rejectedCount}</h2>
            </div>
            <div className="ra-stat-decoration"></div>
          </div>

          <div className="ra-stat-card ra-stat-orange">
            <div className="ra-stat-icon">★</div>
            <div className="ra-stat-content">
              <span>Hired</span>
              <h2>{hiredCount}</h2>
            </div>
            <div className="ra-stat-decoration"></div>
          </div>
        </section>

        {/* Filters */}
        <section className="ra-filter-bar">
          <div className="ra-search-box">
            <span className="ra-search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search by candidate ID, application, job or resume..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="ra-filter-select">
            <span>▣</span>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              {jobIds.map((id) => (
                <option key={id} value={id}>
                  Job #{id}
                </option>
              ))}
            </select>
          </div>

          <div className="ra-filter-select">
            <span>☰</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
              <option value="Selected">Selected</option>
            </select>
          </div>

          <button
            className="ra-refresh-btn"
            onClick={() => {
              setLoading(true);
              fetchApplications();
            }}
            title="Refresh applicants"
          >
            ↻
          </button>
        </section>

        {/* Message */}
        {message && !loading && (
          <div className="ra-message">
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {/* Applicant table */}
        <section className="ra-table-section">
          {loading ? (
            <div className="ra-loading">
              <div className="ra-loader"></div>
              <p>Loading applicants...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="ra-empty">
              <div className="ra-empty-icon">♙</div>
              <h3>No applicants yet</h3>
              <p>Applications for your jobs will appear here.</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="ra-empty">
              <div className="ra-empty-icon">⌕</div>
              <h3>No matching applicants</h3>
              <p>Try changing your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="ra-table-wrapper">
                <table className="ra-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Application Details</th>
                      <th>Job</th>
                      <th>Match Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id}>
                        {/* Candidate */}
                        <td>
                          <div className="ra-candidate-cell">
                            <div className="ra-candidate-avatar">
                              {getInitials(app.candidateId)}
                            </div>

                            <div className="ra-candidate-text">
                              <strong>
                                Candidate #{app.candidateId}
                              </strong>
                              <span>Application #{app.id}</span>
                            </div>
                          </div>
                        </td>

                        {/* Application */}
                        <td>
                          <div className="ra-details-cell">
                            <div>
                              <span className="ra-detail-icon">▤</span>
                              Resume #{app.resumeId}
                            </div>
                            <div>
                              <span className="ra-detail-icon">◷</span>
                              Application #{app.id}
                            </div>
                          </div>
                        </td>

                        {/* Job */}
                        <td>
                          <div className="ra-job-cell">
                            <strong>Job Posting</strong>
                            <span>▣ Job ID: #{app.jobId}</span>
                          </div>
                        </td>

                        {/* Match */}
                        <td>
                          <div className="ra-match-cell">
                            <div className="ra-match-top">
                              <strong>
                                {Number(app.matchScore || 0).toFixed(0)}%
                              </strong>
                            </div>

                            <div className="ra-progress-track">
                              <div
                                className="ra-progress-fill"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      Number(app.matchScore || 0)
                                    )
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span
                            className={`ra-status-badge ${getStatusClass(
                              app.status
                            )}`}
                          >
                            <span className="ra-status-dot"></span>
                            {app.status || "Applied"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="ra-action-cell">
                            <select
                              className="ra-action-select"
                              value={app.status || "Applied"}
                              disabled={updatingId === app.id}
                              onChange={(e) =>
                                updateStatus(app.id, e.target.value)
                              }
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">
                                Shortlisted
                              </option>
                              <option value="Rejected">Rejected</option>
                              <option value="Hired">Hired</option>
                              <option value="Selected">Selected</option>
                            </select>

                            {updatingId === app.id && (
                              <span className="ra-updating">
                                Saving...
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="ra-table-footer">
                <span>
                  Showing <strong>{filteredApplications.length}</strong> of{" "}
                  <strong>{applications.length}</strong> applications
                </span>
                <span className="ra-footer-note">
                  SmartRecruit AI
                </span>
              </div>
            </>
          )}
        </section>

        {/* Back button */}
        <div className="ra-bottom">
          <button
            className="ra-back-btn"
            onClick={() => navigate("/recruiter/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        <footer className="ra-footer">
          Smarter Hiring. A Better Tomorrow.
        </footer>
      </main>
    </div>
  );
}
