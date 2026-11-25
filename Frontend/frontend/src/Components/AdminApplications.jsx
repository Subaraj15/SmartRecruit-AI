
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/AdminCandidates.css";
import AdminSidebar from "./AdminSidebar";

export default function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get("/api/admin/applications");
      setApplications(response.data);
    } catch (err) {
      console.error("Admin applications fetch error:", err);
      setError("Unable to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const candidateId = String(application.candidateId ?? "");
    const jobId = String(application.jobId ?? "");
    const status = application.status || "";

    return (
      candidateId.includes(search) ||
      jobId.includes(search) ||
      status.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
  <>
    <AdminSidebar />

    <div className="admin-candidates-page">

      <div className="admin-candidates-header">
        <div>
          <h1>Applications Management</h1>
          <p>Monitor applications submitted across the platform.</p>
        </div>

        <button
          className="admin-candidates-back"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Dashboard
        </button>
      </div>

      <div className="admin-candidates-summary">
        <div>
          <span>Total Applications</span>
          <h2>{applications.length}</h2>
        </div>
        <div className="admin-candidates-icon">📋</div>
      </div>

      <div className="admin-candidates-container">

        <div className="admin-candidates-toolbar">
          <h2>Application List</h2>

          <input
            type="text"
            placeholder="Search candidate ID, job ID or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-candidates-message">
            Loading applications...
          </p>
        ) : error ? (
          <p className="admin-candidates-error">{error}</p>
        ) : filteredApplications.length === 0 ? (
          <p className="admin-candidates-message">
            No applications found.
          </p>
        ) : (
          <div className="admin-candidates-table-wrapper">
            <table className="admin-candidates-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Candidate ID</th>
                  <th>Job ID</th>
                  <th>Resume ID</th>
                  <th>Match Score</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.id}</td>
                    <td>{application.candidateId ?? "N/A"}</td>
                    <td>{application.jobId ?? "N/A"}</td>
                    <td>{application.resumeId ?? "N/A"}</td>
                    <td>
                      {application.matchScore != null
                        ? `${application.matchScore}%`
                        : "N/A"}
                    </td>
                    <td>
                      <span className="admin-candidate-role">
                        {application.status || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
    </>
  );
}
