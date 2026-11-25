
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/api/admin/dashboard");
      setStats(response.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { label: "Candidates", icon: "👨‍💻", path: "/admin/candidates" },
    { label: "Recruiters", icon: "👔", path: "/admin/recruiters" },
    { label: "Jobs", icon: "💼", path: "/admin/jobs" },
    { label: "Applications", icon: "📄", path: "/admin/applications" },
  ];

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: "👥" },
    { title: "Candidates", value: stats.totalCandidates, icon: "👨‍💻" },
    { title: "Recruiters", value: stats.totalRecruiters, icon: "👔" },
    { title: "Total Jobs", value: stats.totalJobs, icon: "💼" },
    { title: "Applications", value: stats.totalApplications, icon: "📋" },
  ];

  return (
    <div className="admin-layout">

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>SmartRecruit AI</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`admin-menu-item ${
                item.label === "Dashboard" ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      <main className="admin-main">

        <header className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your SmartRecruit AI platform</p>
          </div>
        </header>

        {loading ? (
          <p className="admin-message">Loading dashboard...</p>
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : (
          <>
            <section className="admin-stats-grid">
              {statCards.map((card) => (
                <div className="admin-stat-card" key={card.title}>
                  <div className="admin-stat-icon">{card.icon}</div>
                  <div>
                    <p>{card.title}</p>
                    <h2>{card.value}</h2>
                  </div>
                </div>
              ))}
            </section>

            <section className="admin-welcome">
              <h2>Welcome to Admin Control Center</h2>
              <p>
                Monitor candidates, recruiters, job postings and applications
                from one central dashboard.
              </p>
            </section>

            <section className="admin-quick-actions">
              <h2>Quick Access</h2>

              <div className="admin-action-grid">
                <button onClick={() => navigate("/admin/candidates")}>
                  👨‍💻 Manage Candidates
                </button>

                <button onClick={() => navigate("/admin/recruiters")}>
                  👔 Manage Recruiters
                </button>

                <button onClick={() => navigate("/admin/jobs")}>
                  💼 View Jobs
                </button>

                <button onClick={() => navigate("/admin/applications")}>
                  📋 View Applications
                </button>
              </div>
            </section>
          </>
        )}

      </main>
    </div>
  );
}
