import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import JobList from "./pages/Admin/Jobs/JobList";
import JobDetails from "./pages/Admin/Jobs/JobDetails";
import JobForm from "./pages/Admin/Jobs/JobForm";
import CandidateDashboard from "./pages/Candidate/CandidateDashboard";
import CandidateJobList from "./pages/Candidate/Jobs/CandidateJobList";
import CandidateApplications from "./pages/Candidate/Jobs/CandidateApplications";
import CandidateProfile from "./pages/Candidate/Profile/CandidateProfile";
import JobApplicationForm from "./pages/Candidate/Jobs/JobApplicationForm";
import JobApplications from "./pages/Admin/Jobs/JobApplications";
import AdminUsers from "./pages/Admin/Users/AdminUsers";
import CandidateList from "./pages/Admin/Candidates/CandidateList";
import ScheduledInterviews from "./pages/Admin/ScheduledInterviews/ScheduledInterviews";
import { useParams } from "react-router-dom";

const JobApplicationsForJobRoute = () => {
  const { jobId } = useParams();
  return <JobApplications jobId={jobId} />;
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<JobList />} />
        <Route path="/admin/jobs/create" element={<JobForm />} />
        <Route path="/admin/jobs/edit/:id" element={<JobForm />} />
        <Route path="/admin/jobs/:id" element={<JobDetails />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/jobs" element={<CandidateJobList />} />
        <Route path="/candidate/applications" element={<CandidateApplications />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route
          path="/candidate/jobs/apply/:jobId"
          element={<JobApplicationForm />}
        />
        <Route path="/admin/job-applications" element={<JobApplications />} />
        <Route path="/admin/jobs/:jobId/applications" element={<JobApplicationsForJobRoute />} />
        <Route path="/admin/scheduled-interviews" element={<ScheduledInterviews />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/users/:userId/profile" element={<CandidateProfile />} />
        <Route path="/admin/candidates" element={<CandidateList />} />
      </Routes>
    </Router>
  );
};

export default App;
