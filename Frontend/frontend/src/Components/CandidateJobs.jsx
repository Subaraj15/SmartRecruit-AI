
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../CSS/CandidateJobs.css";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const res = await api.get("/api/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Unable to load jobs:", error);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (job.title || "").toLowerCase().includes(searchText) ||
      (job.description || "").toLowerCase().includes(searchText) ||
      (job.requiredSkills || "").toLowerCase().includes(searchText);

    const experience = Number(job.experience || 0);

    const matchesExperience =
      experienceFilter === "All" ||
      (experienceFilter === "Fresher" && experience === 0) ||
      (experienceFilter === "1-3 Years" &&
        experience >= 1 &&
        experience <= 3) ||
      (experienceFilter === "3+ Years" && experience >= 3);

    return matchesSearch && matchesExperience;
  });

  return (
    <div className="cj-page">

      {/* NAVBAR */}
      <nav className="cj-navbar">
        <h2 className="cj-logo">
          SmartRecruit <span>AI</span>
        </h2>

        <button
          className="cj-nav-button"
          onClick={() => navigate("/candidate/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="cj-hero">
        <div className="cj-hero-content">
          <span className="cj-hero-tag">
            YOUR NEXT CAREER STARTS HERE
          </span>

          <h1>
            Find your <span>dream job.</span>
          </h1>

          <p>
            Discover opportunities, explore roles and find jobs
            that match your skills.
          </p>

          <div className="cj-search-box">
            <span className="cj-search-icon">⌕</span>

            <input
              type="text"
              placeholder="Search job title, skills or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="cj-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* JOB LIST SECTION */}
      <main className="cj-main">

        <aside className="cj-filter-panel">
          <h3>Filters</h3>

          <div className="cj-filter-group">
            <h4>Experience</h4>

            {["All", "Fresher", "1-3 Years", "3+ Years"].map(
              (option) => (
                <button
                  key={option}
                  className={`cj-filter-option ${
                    experienceFilter === option ? "active" : ""
                  }`}
                  onClick={() => setExperienceFilter(option)}
                >
                  {option === "All" ? "All Experience" : option}
                </button>
              )
            )}
          </div>

          <div className="cj-filter-note">
            <div className="cj-filter-note-icon">✦</div>
            <h4>Smart Matching</h4>
            <p>
              Upload your resume to discover how well your skills
              match a job.
            </p>
          </div>
        </aside>

        <section className="cj-list-section">

          <div className="cj-list-header">
            <div>
              <h2>Explore Opportunities</h2>
              <p>Find the right role for your career.</p>
            </div>

            <span className="cj-job-count">
              {filteredJobs.length} Jobs
            </span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="cj-empty">
              <div className="cj-empty-icon">⌕</div>
              <h3>No jobs found</h3>
              <p>
                Try another keyword or change your experience filter.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setExperienceFilter("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="cj-job-list">

              {filteredJobs.map((job) => (
                <article className="cj-job-card" key={job.id}>

                  <div className="cj-card-top">

                    <div className="cj-company-icon">
                      {(job.title || "J").charAt(0).toUpperCase()}
                    </div>

                    <div className="cj-card-title">
                      <h3>{job.title}</h3>
                      <span className="cj-company-label">
                        Recruitment Opportunity
                      </span>
                    </div>

                    <span className="cj-experience-badge">
                      {Number(job.experience || 0) === 0
                        ? "Fresher"
                        : `${job.experience} Years`}
                    </span>

                  </div>

                  <p className="cj-card-description">
                    {job.description}
                  </p>

                  <div className="cj-skills-section">
                    <span className="cj-skills-label">
                      Required Skills
                    </span>

                    <div className="cj-skills-tags">
                      {(job.requiredSkills || "")
                        .split(",")
                        .map((skill, index) => skill.trim())
                        .filter(Boolean)
                        .map((skill, index) => (
                          <span className="cj-skill-tag" key={index}>
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="cj-card-footer">

                    <span className="cj-card-experience">
                      <span>◷</span>
                      {Number(job.experience || 0) === 0
                        ? "No experience required"
                        : `${job.experience} years experience`}
                    </span>

                    <button
                      className="cj-apply-button"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View & Apply <span>→</span>
                    </button>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </main>

      <footer className="cj-footer">
        <p>SmartRecruit AI · Find opportunities. Build your future.</p>
      </footer>

    </div>
  );
}
