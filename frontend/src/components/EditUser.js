import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:5001/usersApi";

function EditUser({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "admin",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "admin",
      });
    }
  }, [user]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.put(BASE_URL + "/users/" + user._id, form, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    alert("User updated");
    onUpdated();
    onClose();
  }

  if (!user) return null;

  return (
    <div className="edit-overlay">
      <form className="edit-form" onSubmit={handleSubmit}>
        <h3>Edit User</h3>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>

        <div className="edit-actions">
          <button className="save-btn" type="submit">
            Save
          </button>

          <button
            className="cancel-btn"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        <Link to="/usersList" className="back-link">
          ← Back to Users
        </Link>
      </form>
    </div>
  );
}

export default EditUser;
