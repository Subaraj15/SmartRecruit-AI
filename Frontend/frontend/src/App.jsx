

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Jobs from "./Components/Jobs";
import CandidateDashboard from "./Components/CandidateDashboard";
import CandidateJobs from "./Components/CandidateJobs";
import JobDetails from "./Components/JobDetails";
import ResumeUpload from "./Components/ResumeUpload";
import MatchResult from "./Components/MatchResult";
import Applications from "./Components/Applications";
import RecruiterDashboard from "./Components/RecruiterDashboard";
import JobChatbot from "./Components/Chatbot";
import RecruiterApplicants from "./Components/RecruiterApplicants";
import AdminDashboard from "./Components/AdminDashboard";
import AdminCandidates from "./Components/AdminCandidates";
import AdminRecruiters from "./Components/AdminRecruiters";
import AdminJobs from "./Components/AdminJobs";
import AdminApplications from "./Components/AdminApplications";
import AdminRegister from "./Components/AdminRegister";


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<LandingPage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CANDIDATE */}
        <Route
          path="/candidate/dashboard"
          element={<CandidateDashboard />}
        />

        <Route path="/jobs" element={<CandidateJobs />} />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route path="/resume" element={<ResumeUpload />} />

        <Route path="/match" element={<MatchResult />} />

        <Route
          path="/applications"
          element={<Applications />}
        />


        {/* RECRUITER */}
        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route path="/recruiter/jobs" element={<Jobs />} />

        {/* CHATBOT */}
        <Route path="/ai-jobs" element={<JobChatbot />} />

        <Route
  path="/recruiter/applicants"
  element={<RecruiterApplicants />}
/>

<Route path="/admin/dashboard" element={<AdminDashboard />} />

<Route path="/admin/candidates" element={<AdminCandidates />} />

<Route path="/admin/recruiters" element={<AdminRecruiters />} />

<Route path="/admin/jobs" element={<AdminJobs />} />

<Route path="/admin/applications" element={<AdminApplications />} />

<Route path="/admin/register" element={<AdminRegister />} />






      </Routes>
    </BrowserRouter>
  );
}

export default App;