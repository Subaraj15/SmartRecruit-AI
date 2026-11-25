
import { useNavigate } from "react-router-dom";
import "../CSS/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          <span className="logo-icon">S</span>
          <span>SmartRecruit<span className="logo-ai"> AI</span></span>
        </div>

        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="landing-nav-buttons">
          <button
            className="landing-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="landing-signup-btn"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero" id="home">

        <div className="landing-hero-content">

          <span className="landing-badge">
            ✦ AI-Powered Recruitment Platform
          </span>

          <h1>
            Find the Right Job.
            <br />
            <span>Build Your Future.</span>
          </h1>

          <p>
            Connect with opportunities that match your skills.
            SmartRecruit AI helps candidates and recruiters
            make smarter hiring decisions.
          </p>

          <div className="landing-hero-buttons">
            <button
              className="landing-primary-btn"
              onClick={() => navigate("/register")}
            >
              Find Jobs →
            </button>

            <button
              className="landing-secondary-btn"
              onClick={() => navigate("/register")}
            >
              Hire Talent
            </button>
          </div>

          <div className="landing-hero-stats">
            <div>
              <h3>Smart</h3>
              <p>Resume Matching</p>
            </div>

            <div>
              <h3>Simple</h3>
              <p>Job Application</p>
            </div>

            <div>
              <h3>Fast</h3>
              <p>Hiring Process</p>
            </div>
          </div>

        </div>

        {/* HERO VISUAL */}
        <div className="landing-hero-visual">

          <div className="hero-feature-panel">

            <div className="hero-feature-item">
              <div className="hero-feature-icon purple">
                <span>⌕</span>
              </div>

              <div>
                <h3>Explore Opportunities</h3>
                <p>Discover jobs for your career</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-feature-icon blue">
                <span>✦</span>
              </div>

              <div>
                <h3>AI Resume Matching</h3>
                <p>Match your skills with job roles</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-feature-icon green">
                <span>↗</span>
              </div>

              <div>
                <h3>Easy Applications</h3>
                <p>Apply with a simple process</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="hero-feature-icon orange">
                <span>▣</span>
              </div>

              <div>
                <h3>Recruiter Portal</h3>
                <p>Manage jobs and applicants</p>
              </div>
            </div>

          </div>

          <div className="hero-feature-highlight">
            <span>✦</span>

            <div>
              <strong>Your career journey starts here</strong>
              <p>Smarter hiring. Better opportunities.</p>
            </div>
          </div>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="landing-features" id="features">

        <div className="landing-section-heading">
          <span>OUR FEATURES</span>
          <h2>Everything you need to move forward</h2>
          <p>
            Tools designed to make recruitment simpler
            for candidates and recruiters.
          </p>
        </div>

        <div className="landing-feature-grid">

          <div className="landing-feature-card">
            <div className="landing-feature-icon purple">⌕</div>
            <h3>Explore Jobs</h3>
            <p>
              Discover job opportunities and explore
              positions that match your career goals.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon blue">✦</div>
            <h3>AI Resume Matching</h3>
            <p>
              Compare resume skills with job requirements
              and understand your match percentage.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon green">↗</div>
            <h3>Easy Applications</h3>
            <p>
              Upload your resume and apply for
              opportunities through a simple process.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="landing-feature-icon orange">▣</div>
            <h3>Recruiter Portal</h3>
            <p>
              Post vacancies and manage applications
              through a dedicated recruiter dashboard.
            </p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="landing-how" id="about">

        <div className="landing-section-heading">
          <span>HOW IT WORKS</span>
          <h2>Your next opportunity in 3 steps</h2>
        </div>

        <div className="landing-steps">

          <div className="landing-step">
            <div className="landing-step-number">01</div>
            <h3>Create Your Account</h3>
            <p>
              Register as a candidate and start exploring
              opportunities.
            </p>
          </div>

          <div className="landing-step">
            <div className="landing-step-number">02</div>
            <h3>Upload Your Resume</h3>
            <p>
              Upload your PDF resume to analyze
              skills against job requirements.
            </p>
          </div>

          <div className="landing-step">
            <div className="landing-step-number">03</div>
            <h3>Match & Apply</h3>
            <p>
              View your matching score and apply
              for suitable jobs.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="landing-cta">

        <h2>Ready to find your next opportunity?</h2>

        <p>
          Start exploring opportunities with SmartRecruit AI.
        </p>

        <button
          onClick={() => navigate("/register")}
        >
          Create Your Account →
        </button>

      </section>

      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="landing-logo">
          <span className="logo-icon">S</span>
          <span>SmartRecruit<span className="logo-ai"> AI</span></span>
        </div>

        <p>
          Smarter hiring. Better opportunities.
        </p>

        <span className="landing-copyright">
          © 2026 SmartRecruit AI. All rights reserved.
        </span>

      </footer>

    </div>
  );
}
