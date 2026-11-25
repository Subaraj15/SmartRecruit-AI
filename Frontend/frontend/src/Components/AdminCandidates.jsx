
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/AdminCandidates.css";

import AdminSidebar from "./AdminSidebar";



export default function AdminCandidates() {
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await api.get("/api/admin/candidates");
      setCandidates(response.data);
    } catch (err) {
      console.error("Candidates fetch error:", err);
      setError("Unable to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const name = candidate.name || "";
    const email = candidate.email || "";

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
          <h1>Candidates Management</h1>
          <p>View and manage registered candidates.</p>
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
          <span>Total Candidates</span>
          <h2>{candidates.length}</h2>
        </div>
        <div className="admin-candidates-icon">👨‍💻</div>
      </div>

      <div className="admin-candidates-container">

        <div className="admin-candidates-toolbar">
          <h2>Candidate List</h2>

          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="admin-candidates-message">Loading candidates...</p>
        ) : error ? (
          <p className="admin-candidates-error">{error}</p>
        ) : filteredCandidates.length === 0 ? (
          <p className="admin-candidates-message">
            No candidates found.
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
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id}>
                    <td>{candidate.id}</td>
                    <td>{candidate.name || "N/A"}</td>
                    <td>{candidate.email || "N/A"}</td>
                    <td>
                      <span className="admin-candidate-role">
                        {candidate.role}
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
