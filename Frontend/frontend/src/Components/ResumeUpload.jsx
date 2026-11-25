import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import "../CSS/ResumeUpload.css";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const getCandidateId = (token) => {
    const base64Payload = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = JSON.parse(atob(base64Payload));
    return Number(payload.id);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setMessage("");
    setMessageType("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFile(null);
      setMessage("Only PDF files are accepted.");
      setMessageType("error");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!file) {
      setMessage("Please select a PDF resume.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setUploading(true);

      const candidateId = getCandidateId(token);

      if (!Number.isInteger(candidateId) || candidateId <= 0) {
        throw new Error("Candidate ID not found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("candidateId", candidateId);
      formData.append("file", file);

      // 1. Upload resume
      const response = await api.post(
        "/api/resumes/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resumeId = Number(response.data.id);

      if (!Number.isInteger(resumeId) || resumeId <= 0) {
        throw new Error("Resume uploaded, but the resume ID was not returned.");
      }

      localStorage.setItem("resumeId", String(resumeId));

      // 2. Calculate match if jobId exists
      if (jobId) {
        const parsedJobId = Number(jobId);

        if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
          throw new Error("Invalid job ID.");
        }

        const matchResponse = await api.post(
          "/api/matches/calculate",
          null,
          {
            params: {
              jobId: parsedJobId,
              resumeId: resumeId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const matchResult = matchResponse.data;
        const score = Number(matchResult.matchScore);

        if (
          matchResult.matchScore == null ||
          !Number.isFinite(score)
        ) {
          throw new Error("Match score was not returned by the server.");
        }

        // 3. Navigate to match results
        navigate(
          `/match?jobId=${parsedJobId}&resumeId=${resumeId}&score=${score}`,
          {
            state: {
              matchResult: matchResult,
            },
          }
        );
      } else {
        setMessage("Resume uploaded successfully!");
        setMessageType("success");
      }
    } catch (error) {
      console.error(
        "Resume upload or analysis error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Resume upload or analysis failed."
      );

      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ru-page">

      <nav className="ru-navbar">
        <h2>
          SmartRecruit <span className="ru-highlight">AI</span>
        </h2>

        <button
          className="ru-nav-button"
          onClick={() => navigate("/candidate/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      <div className="ru-content">
        <div className="ru-card">

          <h1 className="ru-heading">
            Upload Your Resume
          </h1>

          <p className="ru-subtitle">
            Upload your resume and let SmartRecruit analyze
            your skills against the job requirements.
          </p>

          <form onSubmit={handleUpload}>

            <div className="ru-upload-area">

              <div className="ru-upload-icon">
                📄
              </div>

              <h3>Upload your PDF resume</h3>

              <p>
                Select your resume to discover how well your
                skills match the job.
              </p>

              <input
                className="ru-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />

            </div>

            {file && (
              <div className="ru-selected-file">
                <span className="ru-file-icon">📑</span>

                <div>
                  <div className="ru-file-name">
                    {file.name}
                  </div>

                  <small>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </small>
                </div>
              </div>
            )}

            <div className="ru-info">

              <div className="ru-info-item">
                <strong>📄 File format</strong>
                PDF only
              </div>

              <div className="ru-info-item">
                <strong>🤖 AI analysis</strong>
                Skills and job matching
              </div>

              <div className="ru-info-item">
                <strong>🔒 Privacy</strong>
                Resume used for matching
              </div>

            </div>

            <button
              className="ru-submit-button"
              type="submit"
              disabled={uploading}
            >
              {uploading
                ? "Uploading & Analyzing..."
                : "Upload & Analyze →"}
            </button>

          </form>

          {message && (
            <p
              className={`ru-message ${
                messageType === "success"
                  ? "ru-message-success"
                  : "ru-message-error"
              }`}
            >
              {message}
            </p>
          )}

        </div>
      </div>

    </div>
  );
}
