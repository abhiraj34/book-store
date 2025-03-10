import React, { useState } from "react";
import Google from "../img/google.png";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebase";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Save user data to localStorage
  const saveUserData = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userEmail", user.email);
    localStorage.removeItem("orders");
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("newLogin"));
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      await axios.post("http://localhost:5000/api/auth/google-login", {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });

      saveUserData(user.accessToken, { uid: user.uid, email: user.email });
      navigate("/");
    } catch (error) {
      setError("Google sign-in failed. Try again.");
    }
  };

  // Handle Login/Registration with Email & Password
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    const url = isRegistering
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    try {
      const { data } = await axios.post(url, formData);
      if (!data.token || !data.user) throw new Error("Authentication failed");

      saveUserData(data.token, data.user);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div className="login">
      <h1 className="loginTitle">BookStore</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAuth}>
        {isRegistering && (
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        )}
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">{isRegistering ? "Register" : "Login"}</button>
      </form>

      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>

      <div className="wrapper">
        <div className="loginButton google" onClick={handleGoogleSignIn}>
          <img src={Google} alt="Google" className="icon" />
          Continue with Google
        </div>
      </div>
    </div>
  );
};

export default Login;
