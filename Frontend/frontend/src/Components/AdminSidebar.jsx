import { useNavigate, useLocation } from "react-router-dom";
import "../CSS/AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Candidates", path: "/admin/candidates", icon: "👨‍🎓" },
    { label: "Recruiters", path: "/admin/recruiters", icon: "👔" },
    { label: "Jobs", path: "/admin/jobs", icon: "💼" },
    { label: "Applications", path: "/admin/applications", icon: "📄" },
  ];

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar-title">SmartRecruit AI</h2>
      <p className="admin-sidebar-subtitle">Admin Panel</p>

      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`admin-sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="admin-sidebar-logout"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        🚪 Logout
      </button>
    </aside>
  );
}