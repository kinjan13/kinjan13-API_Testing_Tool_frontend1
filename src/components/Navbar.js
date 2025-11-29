import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setDark(!dark);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            API Testing Tool
          </Link>
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            {user && (
              <Link to="/history" className="navbar-link">
                History
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {!user ? (
            <>
              <Link to="/login" className="navbar-button">
                Login
              </Link>
              <Link to="/signup" className="navbar-button">
                Signup
              </Link>
            </>
          ) : (
            <button className="navbar-button navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button
            onClick={toggleTheme}
            className="navbar-button navbar-theme"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
