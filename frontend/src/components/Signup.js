import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email is not valid!";
    if (!formData.password) newErrors.password = "Password is required!";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters!";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/usersApi/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.errors) {
          const serverErrors = {};
          for (const key in data.error.errors) {
            serverErrors[key] = data.error.errors[key].message;
          }
          setErrors(serverErrors);
        }
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful ✅");
      setFormData({ name: "", email: "", password: "" });
      setErrors({});
      navigate("/login");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{
      backgroundColor: "#0B0F1A", // deep black-blue
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        backgroundColor: "#121B2C", // dark blue card
        padding: "50px 100px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <h2 style={{ color: "white", textAlign: "center", marginBottom: "30px", fontSize: "1.8rem" }}>
          Create New account
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
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
            />
            {errors.name && <p style={{ color: "#FF6B6B", marginTop: "5px" }}>{errors.name}</p>}
          </div>

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
            />
            {errors.email && <p style={{ color: "#FF6B6B", marginTop: "5px" }}>{errors.email}</p>}
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
            />
            {errors.password && <p style={{ color: "#FF6B6B", marginTop: "5px" }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px auto",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#1E2A47", // dark blue
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#263757"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1E2A47"}
          >
            Signup
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

export default Signup;
