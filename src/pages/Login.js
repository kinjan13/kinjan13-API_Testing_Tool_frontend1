import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastContext } from "../context/ToastContext";
import { useNavigate, Link, Navigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [apiDebugUrl, setApiDebugUrl] = useState("");
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

  const doLogin = async () => {
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      // Debug: show what API URL is being used
      // eslint-disable-next-line no-console
      console.log("API URL:", apiClient.defaults.baseURL, "REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

      // Use dedicated apiClient configured with the backend URL
      const loginUrl = "/auth/login";
      setApiDebugUrl(`${apiClient.defaults.baseURL}${loginUrl}`);

      const res = await apiClient.post(loginUrl, { email, password });

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

  const handleLogin = async (e) => {
    e.preventDefault();
    await doLogin();
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

        {error && (
          <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "#fff7f7", border: "1px solid #f5c6cb" }}>
            <div style={{ marginBottom: 8, color: "#611a15" }}><strong>Debug</strong></div>
            <div style={{ fontSize: 13, color: "#611a15", marginBottom: 8 }}>API URL used: <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4 }}>{apiDebugUrl || process.env.REACT_APP_API_URL || "(none)"}</code></div>
            <div>
              <button onClick={(e) => { e.preventDefault(); doLogin(); }} disabled={loading} style={{ marginRight: 8, padding: "6px 10px" }}>Retry</button>
              {apiDebugUrl ? (
                <a href={apiDebugUrl} target="_blank" rel="noreferrer" style={{ color: "#2b6cb0" }}>Open API root</a>
              ) : (
                <span style={{ color: "#666" }}>No API URL available to open</span>
              )}
            </div>
          </div>
        )}

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
