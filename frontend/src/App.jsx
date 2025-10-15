import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import JobList from "./pages/Admin/Jobs/JobList";
import JobDetails from "./pages/Admin/Jobs/JobDetails";
import JobForm from "./pages/Admin/Jobs/JobForm";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/jobs" element={<JobList />} />
        <Route path="/admin/jobs/create" element={<JobForm />} />
        <Route path="/admin/jobs/edit/:id" element={<JobForm />} />
        <Route path="/admin/jobs/:id" element={<JobDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
