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
    <nav
      style={{
        background: "#222",
        padding: "10px 20px",
        marginBottom: "20px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/" style={{ color: "white", marginRight: "15px" }}>
          Home
        </Link>

        {user && (
          <Link to="/history" style={{ color: "white", marginRight: "15px" }}>
            History
          </Link>
        )}
      </div>

      <div>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
              Login
            </Link>
            <Link to="/signup" style={{ color: "white", marginRight: "15px" }}>
              Signup
            </Link>
          </>
        ) : (
          <button
            style={{
              padding: "6px 12px",
              background: "darkred",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "15px",
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        <button
          onClick={toggleTheme}
          style={{
            padding: "6px 12px",
            background: "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {dark ? "Light" : "Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
