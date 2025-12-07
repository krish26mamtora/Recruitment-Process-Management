import { Link } from "react-router-dom";
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
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>

        {userRoles.includes("Admin") ? (
          <>
            <li className="nav-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users">Manage Users</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/jobs">Manage Jobs</Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/candidates">Candidates</Link>
            </li>
          </>
        ) : null}

        {userRoles.includes("Candidate") ? (
          <>
            <li className="nav-item">
              <Link to="/candidate/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/candidate/jobs">Jobs</Link>
            </li>
            <li className="nav-item">
              <Link to="/candidate/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link to="/candidate/applications">Applications</Link>
            </li>
          </>
        ) : null}

        {!isLoggedIn && (
          <>
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register">Register</Link>
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
    </nav>
  );
};

export default Navbar;
