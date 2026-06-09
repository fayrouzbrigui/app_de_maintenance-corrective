import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:5001/platesApi";

function EditPlate({ plate, onClose, onUpdated }) {
  const [form, setForm] = useState({
    plateText: "",
    status: "unkown",
  });

  useEffect(() => {
    if (plate) {
      setForm({
        plateText: plate.plateText || "",
        status: plate.plateText || "unkown",
      });
    }
  }, [plate]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.put(BASE_URL + "/update/" + plate._id, form, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    alert("Plate updated");
    onUpdated();
    onClose();
  }

  if (!plate) return null;

  return (
    <div className="edit-overlay">
      <form className="edit-form" onSubmit={handleSubmit}>
        <h3>Edit Plate</h3>

        <input
          name="plateText"
          value={form.plateText}
          onChange={handleChange}
        />


        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="allowed">Allowed</option>
          <option value="denied">Denied</option>
          <option value="unkown">Unkown</option>
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

        <Link to="/platesList" className="back-link">
          ← Back to Plates
        </Link>
      </form>
    </div>
  );
}

export default EditPlate;
