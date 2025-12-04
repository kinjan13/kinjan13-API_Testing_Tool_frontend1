import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      // Debug: show what baseURL axios is using in runtime
      // eslint-disable-next-line no-console
      console.log("axios baseURL (before login):", axios.defaults.baseURL, "REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

      // Prefer explicit REACT_APP_API_URL when available (avoids proxy/CORS surprises).
      // If REACT_APP_API_URL is set, call the full URL first. Otherwise use relative path (proxy).
      // eslint-disable-next-line no-console
      console.log("axios baseURL (before login):", axios.defaults.baseURL, "REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

      const apiRoot = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, "") : "";
      const primaryUrl = apiRoot ? `${apiRoot}/auth/login` : `/auth/login`;
      let res;
      try {
        // Primary attempt
        res = await axios.post(primaryUrl, { email, password });
      } catch (requestErr) {
        // eslint-disable-next-line no-console
        console.warn("Login request failed:", requestErr?.message || requestErr);
        const isNetworkError = (requestErr?.message || "").toLowerCase().includes("network");
        if (isNetworkError && apiRoot) {
          // If primary was full URL and failed due to network/CORS, attempt relative path as a fallback (CRA proxy)
          const fallback = `/auth/login`;
          // eslint-disable-next-line no-console
          console.log("Falling back to relative URL:", fallback);
          res = await axios.post(fallback, { email, password });
        } else {
          // rethrow for outer catch to handle
          throw requestErr;
        }
      }

      // Debug: log full response when running locally
      // eslint-disable-next-line no-console
      console.log("Login response:", res);

      // Backend may return different shapes. Accept if:
      // - res.data.success === true OR
      // - res.data.token exists OR
      // - no res.data.error flag
      const data = res.data || {};
      const token = data.token || data.access_token || data?.data?.token;

      if (data.error) {
        setError(data.message || "Login failed");
        showToast(data.message || "Login failed", "error");
        return;
      }

      if (!token) {
        setError(data.message || "Login succeeded but no token returned from server");
        showToast(data.message || "Login succeeded but no token returned", "error");
        return;
      }

      login(data.user || data.data?.user || {}, token);
      showToast("Logged in successfully", "success");
      navigate("/");
    } catch (err) {
      // Better error messages for debugging
      // eslint-disable-next-line no-console
      console.error("Login error:", err.response || err);
      const serverMessage = err.response?.data?.message || err.response?.data || err.message;
      // If this was a network / CORS failure, show a clearer message to the user
      if ((err?.message || "").toLowerCase().includes("network")) {
        const msg = "Network error: could not reach the API. Check backend availability or CORS settings (see browser console).";
        setError(msg);
        showToast(msg, "error");
      } else {
        setError(serverMessage || "Login failed. Please try again.");
        showToast(serverMessage || "Login failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to your API Testing Tool account</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
