import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../CSS/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
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

      const endpoint =
        role === "CANDIDATE"
          ? "http://localhost:8080/api/auth/candidate/register"
          : "http://localhost:8080/api/auth/recruiter/register";

      await axios.post(endpoint, {
        name,
        email,
        password,
      });

      setMessage("Registration successful! Redirecting to login...");

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err.response?.status || err.message);

      setMessage(
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* LEFT PANEL */}
      <div className="register-left-panel">

        <div className="register-brand" onClick={() => navigate("/")}>
          <div className="register-brand-icon">S</div>
          <span>SmartRecruit <span>AI</span></span>
        </div>

        <div className="register-left-content">

          <span className="register-left-tag">
            ✦ YOUR CAREER JOURNEY STARTS HERE
          </span>

          <h1>
            Unlock new
            <span> possibilities.</span>
          </h1>

          <p>
            Join SmartRecruit AI to discover meaningful career
            opportunities or connect with talented candidates.
          </p>

          <div className="register-benefits">

            <div className="register-benefit">
              <span className="register-benefit-icon">✦</span>
              <div>
                <h4>Discover Better Matches</h4>
                <p>Find jobs that align with your skills and goals.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon">↗</span>
              <div>
                <h4>Grow Your Career</h4>
                <p>Explore new opportunities and career paths.</p>
              </div>
            </div>

            <div className="register-benefit">
              <span className="register-benefit-icon">✓</span>
              <div>
                <h4>Simplify Recruitment</h4>
                <p>Connect candidates and recruiters in one platform.</p>
              </div>
            </div>

          </div>

        </div>

        <div className="register-left-footer">
          Smarter hiring. Better opportunities.
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="register-right-panel">

        <div className="register-form-container">

          <button
            className="register-back-home"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <div className="register-mobile-brand">
            <div className="register-brand-icon">S</div>
            <span>SmartRecruit <span>AI</span></span>
          </div>

          <div className="register-heading">
            <span className="register-welcome-tag">
              CREATE YOUR ACCOUNT
            </span>

            <h2>Get started today</h2>

            <p>Create your account and join SmartRecruit AI.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">

            {/* NAME */}
            <div className="register-input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            {/* EMAIL */}
            <div className="register-input-group">
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

            {/* PASSWORD */}
            <div className="register-input-group">
              <label>Password</label>

              <div className="register-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ROLE */}
            <div className="register-input-group">
              <label>Register As</label>

              <div className="register-role-options">

                <button
                  type="button"
                  className={`register-role-card ${
                    role === "CANDIDATE" ? "selected" : ""
                  }`}
                  onClick={() => setRole("CANDIDATE")}
                >
                  <span className="register-role-icon">👤</span>
                  <span className="register-role-title">Candidate</span>
                  <span className="register-role-desc">
                    Find jobs & apply
                  </span>
                </button>

                <button
                  type="button"
                  className={`register-role-card ${
                    role === "RECRUITER" ? "selected" : ""
                  }`}
                  onClick={() => setRole("RECRUITER")}
                >
                  <span className="register-role-icon">🏢</span>
                  <span className="register-role-title">Recruiter</span>
                  <span className="register-role-desc">
                    Post jobs & hire
                  </span>
                </button>

              </div>
            </div>

            {/* MESSAGE */}
            {message && (
              <div
                className={`register-message ${
                  message.toLowerCase().includes("successful")
                    ? "success"
                    : "error"
                }`}
                role="status"
              >
                {message}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>

          </form>

          <div className="register-login-text">
            Already have an account?
            <button onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>

          <div className="register-bottom-note">
            <span>✦</span> Powered by SmartRecruit AI
          </div>

        </div>

      </div>

    </div>
  );
}
