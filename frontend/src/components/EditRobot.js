import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:5001/robotsApi";

function EditRobot({ robot, onClose, onUpdated }) {
  const [form, setForm] = useState({
    reference: "",
    ipAddress: "",
    uuid: "",
  });

  useEffect(() => {
    if (robot) {
      setForm({
        reference: robot.reference || "",
        ipAddress: robot.ipAddress || "",
        uuid: robot.uuid || "",
      });
    }
  }, [robot]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.put(BASE_URL + "/robots/" + robot._id, form, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    alert("Robot updated");
    onUpdated();
    onClose();
  }

  if (!robot) return null;

  return (
    <div className="edit-overlay">
      <form className="edit-form" onSubmit={handleSubmit}>
        <h3>Edit Robot</h3>

        <input
          name="reference"
          value={form.reference}
          onChange={handleChange}
        />

        <input
          name="ipAddress"
          value={form.ipAddress}
          onChange={handleChange}
        />

        <input
          name="uuid"
          value={form.uuid}
          onChange={handleChange}
        />

        

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

        <Link to="/robotsList" className="back-link">
          ← Back to Robots
        </Link>
      </form>
    </div>

  );
}

export default EditRobot;
