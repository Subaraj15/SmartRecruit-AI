
import { useState } from "react";
import api from "../api";
import "../CSS/JobChatbot.css";

function JobChatbot() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        try {
            setLoading(true);
            setReply("");
            setJobs([]);

            const token = localStorage.getItem("token");

            if (!token) {
                setReply("Please log in again to use the AI Job Assistant.");
                return;
            }

            const response = await api.post(
                "/api/chatbot/message",
                { message: message.trim() }
            );

            setReply(
                response.data?.reply ||
                "No reply was provided."
            );

            setJobs(
                Array.isArray(response.data?.jobs)
                    ? response.data.jobs
                    : []
            );

            setMessage("");
        } catch (error) {
            console.error("Chatbot error status:", error.response?.status);
            console.error("Chatbot error response:", error.response?.data);
            console.error("Chatbot request URL:", error.config?.url);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                setReply(
                    "Your session may have expired or access was denied. Please log in again."
                );
            } else {
                setReply(
                    "Unable to connect. Please check that your backend and Ollama are running."
                );
            }

            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ja-widget">

            {/* Chat Window */}
            {isOpen && (
                <div className="ja-window">

                    {/* Header */}
                    <div className="ja-header">
                        <div className="ja-header-info">
                            <div className="ja-avatar">✦</div>

                            <div>
                                <strong>Job Assistant</strong>
                                <span>SmartRecruit AI</span>
                            </div>
                        </div>

                        <button
                            className="ja-close"
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chatbot"
                        >
                            ×
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="ja-chat-body">

                        {!reply && jobs.length === 0 && (
                            <div className="ja-welcome-message">
                                <div className="ja-welcome-icon">✦</div>

                                <h3>Hello! 👋</h3>

                                <p>
                                    I'm your AI Job Assistant.
                                    Tell me about your skills, experience,
                                    or the job you're looking for.
                                </p>

                                <div className="ja-example">
                                    <strong>Example</strong>
                                    <p>
                                        I know Java, Spring Boot and MySQL.
                                        Find jobs suitable for me.
                                    </p>
                                </div>
                            </div>
                        )}

                        {reply && (
                            <div className="ja-message-bubble">
                                <div className="ja-bot-label">
                                    ✦ Assistant
                                </div>

                                <p>{reply}</p>
                            </div>
                        )}

                        {jobs.map((job) => (
                            <div className="ja-job-card" key={job.id}>

                                <div className="ja-job-card-top">
                                    <div className="ja-job-icon">💼</div>

                                    <span className="ja-match-badge">
                                        {job.matchPercentage}% Match
                                    </span>
                                </div>

                                <h3>{job.title}</h3>

                                <p className="ja-job-description">
                                    {job.description}
                                </p>

                                <div className="ja-job-detail">
                                    <strong>Skills</strong>
                                    <p>
                                        {job.requiredSkills ||
                                            "Not specified"}
                                    </p>
                                </div>

                                <div className="ja-job-detail">
                                    <strong>Experience</strong>
                                    <p>
                                        {job.experience ?? "Not specified"}
                                        {job.experience != null &&
                                            String(job.experience).toLowerCase().includes("year")
                                            ? ""
                                            : job.experience != null
                                                ? " years"
                                                : ""}
                                    </p>
                                </div>

                                <div className="ja-job-score">
                                    <div className="ja-score-track">
                                        <div
                                            className="ja-score-fill"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(
                                                        Number(job.matchPercentage) || 0,
                                                        0
                                                    ),
                                                    100
                                                )}%`
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}

                        {loading && (
                            <div className="ja-loading">
                                <div className="ja-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>

                                <span>Finding matching jobs...</span>
                            </div>
                        )}

                    </div>

                    {/* Input */}
                    <div className="ja-input-area">

                        <textarea
                            className="ja-textarea"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" &&
                                    !event.shiftKey
                                ) {
                                    event.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Tell me about your skills..."
                            rows={2}
                        />

                        <button
                            type="button"
                            className="ja-send-button"
                            onClick={sendMessage}
                            disabled={loading || !message.trim()}
                        >
                            {loading ? "Searching..." : "Find Jobs  →"}
                        </button>

                        <div className="ja-input-hint">
                            Enter to send · Shift + Enter for new line
                        </div>

                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                type="button"
                className={`ja-floating-button ${isOpen ? "ja-open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close Job Assistant" : "Open Job Assistant"}
            >
                {isOpen ? (
                    <span className="ja-floating-close">×</span>
                ) : (
                    <>
                        <span className="ja-floating-icon">✦</span>
                        <span className="ja-floating-text">
                            Job Assistant
                        </span>
                    </>
                )}
            </button>

        </div>
    );
}

export default JobChatbot;
