import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];

  const handleLogout = () => {
    localStorage.clear();

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    navigate("/");
  };

  const isLoggedIn = userRoles.length > 0;
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <Link to="/" className="nav-brand-link">Recruitment Portal</Link>
        </div>

        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Home</NavLink>
          </li>

          {userRoles.includes("Admin") ? (
            <>
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Manage Users</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/jobs" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Manage Jobs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/scheduled-interviews" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Scheduled Interviews</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin/candidates" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Candidates</NavLink>
              </li>
            </>
          ) : null}

          {userRoles.includes("Candidate") ? (
            <>
              <li className="nav-item">
                <NavLink to="/candidate/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/candidate/jobs" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Jobs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/candidate/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Profile</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/candidate/applications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Applications</NavLink>
              </li>
            </>
          ) : null}

          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>Register</NavLink>
              </li>
            </>
          )}

          {/* Logout button if logged in */}
          {isLoggedIn && (
            <li className="nav-item">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
