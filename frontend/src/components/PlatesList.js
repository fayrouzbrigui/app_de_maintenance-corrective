/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUser from "./EditPlate";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/platesApi";

function PlateList() {
  const [plates, setPlates] = useState([]);
  const [selectedPlate, setSelectedPlat] = useState(null);

  async function fetchPlates() {
    const res = await axios.get(BASE_URL + "/plates", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setPlates(res.data.data.plates);
  }

  async function deletePlate(id) {
    if (!window.confirm("Delete this plate?")) return;

    await axios.delete(BASE_URL + "/delete/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    fetchPlates();
  }

  useEffect(() => {
    fetchPlates();
  }, []);

  return (
    <>
      <style>
        {`
          .layout {
            display: flex;
            min-height: 100vh;
            background-color: #0b132b;
          }

          .plates-container {
            flex: 1;
            padding: 40px;
            color: #ffffff;
          }

          .plates-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .add-plate-link {
            background-color: #1c7ed6;
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }

          .add-plate-link:hover {
            background-color: #1864ab;
          }

          .action-btn {
            margin-right: 8px;
            padding: 6px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
          }

          .edit-btn {
            background-color: #f59f00;
            color: #000000;
          }

          .delete-btn {
            background-color: #e03131;
            color: #ffffff;
          }

          .action-btn:hover {
            opacity: 0.9;
          }
        `}
      </style>

      <div className="layout">
        <Sidebar />

        <div className="plates-container">
          <div className="plates-header">
            <h2>All Plates</h2>
            <Link to="/addPlate" className="add-plate-link">
              + Add Plate
            </Link>
          </div>

          {selectedPlate && (
            <EditPlate
              plate={selectedPlate}
              onClose={() => setSelectedPlate(null)}
              onUpdated={fetchPlates}
            />
          )}

          <table className="table">
            <thead>
              <tr>
                <th>PlateText</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {plates.map((plate) => (
                <tr key={plate._id}>
                  <td>{plate.plateText}</td>
                  <td>{plate.status}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => setSelectedPlate(plate)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteUser(plate._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PlateList;*/
