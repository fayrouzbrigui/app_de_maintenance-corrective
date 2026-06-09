import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/usersApi/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Store JWT token
      localStorage.setItem("token", data.token);

      setMessage("Login successful ✅");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: "#0B0F1A",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        backgroundColor: "#121B2C",
        padding: "40px 30px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "1.8rem" }}>
          Welcome Back To The Platform
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #1E2A47",
                backgroundColor: "#0B0F1A",
                color: "white",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 15px",
                borderRadius: "8px",
                border: "1px solid #1E2A47",
                backgroundColor: "#0B0F1A",
                color: "white",
                fontSize: "1rem"
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1E2A47",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#263757"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1E2A47"}
          >
            Login
          </button>
        </form>

        {message && (
          <p style={{
            color: message.includes("successful") ? "#4ADE80" : "#FF6B6B",
            textAlign: "center",
            marginTop: "20px"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
