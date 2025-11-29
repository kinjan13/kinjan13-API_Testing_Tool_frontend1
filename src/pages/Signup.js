import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/signup`, {
      email,
      password,
    });

    if (res.data.error) {
      alert(res.data.message);
      return;
    }

    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="container section">
      <h2>Signup</h2>

      <input type="email" placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>Create Account</button>
    </div>
  );
}

export default Signup;
