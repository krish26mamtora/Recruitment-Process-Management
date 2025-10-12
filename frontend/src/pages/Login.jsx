import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        alert(`Welcome, ${data.fullName}`);
        localStorage.setItem("fullName", data.fullName);
        localStorage.setItem("email", data.email);
        localStorage.setItem("userId", data.userId); // or whatever key backend sends
        localStorage.setItem("userRoles", JSON.stringify(data.roles)); // localStorage.setItem("userRoles", JSON.stringify(data.roles));

        const roles = data.roles;
        if (roles.includes("ROLE_ADMIN") || roles.includes("Admin")) {
          navigate("/admin/dashboard");
        } else if (roles.includes("ROLE_HR")) {
          navigate("/hr/dashboard");
        } else if (roles.includes("ROLE_RECRUITER")) {
          navigate("/recruiter/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
        <a href="/register">Register</a>
      </form>
    </div>
  );
};

export default Login;
