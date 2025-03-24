import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle authentication (Login/Register/Admin)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const url = isAdminLogin
      ? "http://localhost:5000/api/auth/admin-login"
      : isRegistering
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const { data } = await axios.post(url, formData);

      if (isRegistering) {
        alert("Registered successfully!");
        setIsRegistering(false); // Switch to login form
        return;
      }

      if (!data.token) throw new Error("Authentication failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Clear previous orders on login
      window.dispatchEvent(new Event("newLogin"));

      navigate(data.user.role === "admin" ? "/admin" : "/");
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Login/Register failed");
    }
  };

  return (
    <div className="login">
      <h1 className="loginTitle">{isAdminLogin ? "Admin Login" : "BookStore"}</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAuth}>
        {isAdminLogin ? (
          <input
            type="text"
            name="username"
            placeholder="Admin Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        ) : (
          <>
            {isRegistering && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {isRegistering ? "Register" : isAdminLogin ? "Login as Admin" : "Login"}
        </button>
      </form>

      <div className="auth-options">
        {!isAdminLogin ? (
          <>
            <p onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
            </p>
            <p onClick={() => { setIsAdminLogin(true); setIsRegistering(false); }}>Login as Admin</p>
          </>
        ) : (
          <p onClick={() => { setIsAdminLogin(false); setIsRegistering(false); }}>Back to User Login</p>
        )}
      </div>
    </div>
  );
};

export default Login;
