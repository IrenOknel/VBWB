import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../utils/apiConfig";
import "./pageUser.css";
import { saveUserToLocalStorage } from "../utils/localStorageHelper";

const PageUser = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setShowLogin(!showLogin);
    setFormData({ email: "", password: "", name: "" });
    setMessage("");
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("Received:", text);
        throw new Error(`Unexpected response: ${response.status}`);
      }

      const result = await response.json();

      if (response.status === 200) {
        saveUserToLocalStorage(result.data);
        setMessage("Login successful!");
        navigate("/weather");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login.");
    }
  };

  const handleSignUp = async e => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const text = await response.text();
        console.log("Received:", text);
        throw new Error(`Unexpected response: ${response.status}`);
      }

      const result = await response.json();

      if (response.status === 201) {
        setMessage("Registration successful!");
        toggleForm();
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("An error occurred during registration.");
    }
  };

  return (
    <div className="page-user">
      <div className="page-content">
        <div className="form-container">
          {showLogin
            ? <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit">Login</button>
                </form>
                <p>
                  {message}
                </p>
                <p>
                  Don't have an account?{" "}
                  <span className="toggle-form" onClick={toggleForm}>
                    Sign up here
                  </span>
                </p>
              </div>
            : <div className="signin-form">
                <h2>Sign In</h2>
                <form onSubmit={handleSignUp}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="submit">Register</button>
                </form>
                <p>
                  {message}
                </p>
                <p>
                  Already have an account?{" "}
                  <span className="toggle-form" onClick={toggleForm}>
                    Login here
                  </span>
                </p>
              </div>}
        </div>
        <div className="hook-description">
          <h1 className="vibe-weather-title">
            Meet your personal Vibe Based Weather Buddy!
          </h1>
          <p className="vibe-description">
            Whether it's cozy sweater weather, sunny beach vibes, or the perfect
            time to sip a latte in a café, this app selects the day’s energy to
            match your lifestyle. Simple, fun, and effortlessly cool. It’s time
            to stop checking the weather and start feeling it!!! Login now to
            let your vibe set the forecast!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageUser;
