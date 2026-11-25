import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setMessage("");

      let endpoint = "";

      if (role === "CANDIDATE") {
        endpoint = "/api/auth/candidate/login";
      } else if (role === "RECRUITER") {
        endpoint = "/api/auth/recruiter/login";
      } else if (role === "ADMIN") {
        endpoint = "/api/auth/admin/login";
      }

      const res = await axios.post(
        `http://localhost:8080${endpoint}`,
        { email, password }
      );

      const token = res.data?.token;

      if (!token) {
        setMessage("Login response did not contain a token.");
        return;
      }

      localStorage.setItem("token", token);

      let tokenRole = role;

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        if (payload.role) {
          tokenRole = payload.role.toUpperCase();
        }
      } catch (tokenError) {
        console.warn("Could not read token role; using selected role.");
      }

      if (tokenRole !== role) {
        localStorage.removeItem("token");
        setMessage("The account role does not match your selected login.");
        return;
      }

      setMessage("Login successful!");

      if (tokenRole === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (tokenRole === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else if (tokenRole === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        localStorage.removeItem("token");
        setMessage("Unknown user role.");
      }

    } catch (err) {
      console.error("Login failed:", err.response?.status || err.message);

      localStorage.removeItem("token");

      if (err.response?.status === 403) {
        setMessage("Access denied. Check your account role and password.");
      } else if (err.response?.status === 401) {
        setMessage("Invalid email or password.");
      } else {
        setMessage(
          typeof err.response?.data === "string"
            ? err.response.data
            : "Login failed. Please check your email and password."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-left-panel">

        <div className="login-brand" onClick={() => navigate("/")}>
          <div className="login-brand-icon">S</div>
          <span>SmartRecruit <span>AI</span></span>
        </div>

        <div className="login-left-content">

          <span className="login-left-tag">
            ✦ SMARTER CAREER CONNECTIONS
          </span>

          <h1>
            Your next career chapter
            <span> starts here.</span>
          </h1>

          <p>
            Discover opportunities, showcase your skills and
            find jobs that match your potential with SmartRecruit AI.
          </p>

          <div className="login-benefits">

            <div className="login-benefit">
              <span className="login-benefit-icon">✦</span>
              <div>
                <h4>AI Resume Matching</h4>
                <p>Discover how your skills match job requirements.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">↗</span>
              <div>
                <h4>Career Opportunities</h4>
                <p>Explore jobs that align with your skills.</p>
              </div>
            </div>

            <div className="login-benefit">
              <span className="login-benefit-icon">✓</span>
              <div>
                <h4>Easy Application Tracking</h4>
                <p>Keep track of the jobs you've applied for.</p>
              </div>
            </div>

          </div>

        </div>

        <div className="login-left-footer">
          Smarter hiring. Better opportunities.
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="login-right-panel">

        <div className="login-form-container">

          <button
            className="login-back-home"
            type="button"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <div className="login-mobile-brand">
            <div className="login-brand-icon">S</div>
            <span>SmartRecruit <span>AI</span></span>
          </div>

          <div className="login-heading">
            <span className="login-welcome-tag">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue.</p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="login-role-selector">

            <button
              type="button"
              className={`login-role-btn ${
                role === "CANDIDATE" ? "active" : ""
              }`}
              onClick={() => {
                setRole("CANDIDATE");
                setMessage("");
              }}
            >
              Candidate
            </button>

            <button
              type="button"
              className={`login-role-btn ${
                role === "RECRUITER" ? "active" : ""
              }`}
              onClick={() => {
                setRole("RECRUITER");
                setMessage("");
              }}
            >
              Recruiter
            </button>

            <button
              type="button"
              className={`login-role-btn ${
                role === "ADMIN" ? "active" : ""
              }`}
              onClick={() => {
                setRole("ADMIN");
                setMessage("");
              }}
            >
              Admin
            </button>

          </div>

          <form onSubmit={handleSubmit} className="login-form">

            <div className="login-input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <div className="login-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && (
              <div className="login-message" role="status">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : `Sign In as ${role === "RECRUITER" ? "Recruiter" : role === "ADMIN" ? "Admin" : "Candidate"} →`}
            </button>

          </form>

          {role !== "ADMIN" && (
            <div className="login-register-text">
              Don't have an account?
              <button
                type="button"
                onClick={() => navigate("/register")}
              >
                Create an account
              </button>
            </div>
          )}

          {role === "ADMIN" && (
  <div className="login-register-text">
    Don't have an Admin account?
    <button
      type="button"
      onClick={() => navigate("/admin/register")}
    >
      Register as Admin
    </button>
  </div>
)}

          <div className="login-bottom-note">
            <span>✦</span> Powered by SmartRecruit AI
          </div>

        </div>

      </div>

    </div>
  );
}
