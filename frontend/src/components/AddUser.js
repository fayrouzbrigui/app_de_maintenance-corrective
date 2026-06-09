import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/usersApi";

function AddUser({ onUserAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(BASE_URL + "/users", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      alert("User created successfully");
      setForm({ name: "", email: "", password: "", role: "admin" });
      onUserAdded();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  }

  return (

      <div className="layout">
        <Sidebar />

        <div className="add-container">
          <div style={{ display: "flex", flexDirection: "column", width: "360px" }}>
            <Link to="/usersList" className="back-link">
              ← Back to Users
            </Link>

            <form className="add-form" onSubmit={handleSubmit}>
              <h2>Add User</h2>

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />

              <select name="role" value={form.role} onChange={handleChange}>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
              </select>

              <button type="submit">Create User</button>
            </form>
          </div>
        </div>
      </div>
  
  );
}

export default AddUser;
