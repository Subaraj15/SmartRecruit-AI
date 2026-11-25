
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/AdminCandidates.css";
import AdminSidebar from "./AdminSidebar";


export default function AdminRecruiters() {
  const navigate = useNavigate();

  const [recruiters, setRecruiters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await api.get("/api/admin/recruiters");
      setRecruiters(response.data);
    } catch (err) {
      console.error("Recruiters fetch error:", err);
      setError("Unable to load recruiters.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const name = recruiter.name || "";
    const email = recruiter.email || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

 return (
  <>
    <AdminSidebar />

    <div className="admin-candidates-page">

      <div className="admin-candidates-header">
        <div>
          <h1>Recruiters Management</h1>
          <p>View registered recruiters on the platform.</p>
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
          <span>Total Recruiters</span>
          <h2>{recruiters.length}</h2>
        </div>
        <div className="admin-candidates-icon">👔</div>
      </div>

      <div className="admin-candidates-container">

        <div className="admin-candidates-toolbar">
          <h2>Recruiter List</h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-candidates-message">Loading recruiters...</p>
        ) : error ? (
          <p className="admin-candidates-error">{error}</p>
        ) : filteredRecruiters.length === 0 ? (
          <p className="admin-candidates-message">
            No recruiters found.
          </p>
        ) : (
          <div className="admin-candidates-table-wrapper">
            <table className="admin-candidates-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecruiters.map((recruiter) => (
                  <tr key={recruiter.id}>
                    <td>{recruiter.id}</td>
                    <td>{recruiter.name || "N/A"}</td>
                    <td>{recruiter.email || "N/A"}</td>
                    <td>
                      <span className="admin-candidate-role">
                        {recruiter.role}
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
