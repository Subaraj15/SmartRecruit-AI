
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/AdminCandidates.css";
import AdminSidebar from "./AdminSidebar";



export default function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/api/admin/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Admin jobs fetch error:", err);
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const title = job.title || "";
    const skills = job.requiredSkills || "";

    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      skills.toLowerCase().includes(search.toLowerCase())
    );
  });

 return (
  <>
    <AdminSidebar />

    <div className="admin-candidates-page">

      <div className="admin-candidates-header">
        <div>
          <h1>Jobs Management</h1>
          <p>View all job postings across SmartRecruit AI.</p>
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
          <span>Total Job Postings</span>
          <h2>{jobs.length}</h2>
        </div>
        <div className="admin-candidates-icon">💼</div>
      </div>

      <div className="admin-candidates-container">

        <div className="admin-candidates-toolbar">
          <h2>Job List</h2>

          <input
            type="text"
            placeholder="Search by title or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-candidates-message">Loading jobs...</p>
        ) : error ? (
          <p className="admin-candidates-error">{error}</p>
        ) : filteredJobs.length === 0 ? (
          <p className="admin-candidates-message">No jobs found.</p>
        ) : (
          <div className="admin-candidates-table-wrapper">
            <table className="admin-candidates-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Job Title</th>
                  <th>Required Skills</th>
                  <th>Experience</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title || "N/A"}</td>
                    <td>{job.requiredSkills || "N/A"}</td>
                    <td>{job.experience || "N/A"}</td>
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
