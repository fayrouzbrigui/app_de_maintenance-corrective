import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditRobot from "./EditRobot";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/robotsApi";

function RobotList() {
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);

  async function fetchRobots() {
    const res = await axios.get(BASE_URL + "/robots", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setRobots(res.data.data.robots);
  }

  async function deleteRobot(id) {
    if (!window.confirm("Delete this robot?")) return;

    await axios.delete(BASE_URL + "/robots/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    fetchRobots();
  }

  useEffect(() => {
    fetchRobots();
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

          .robots-container {
            flex: 1;
            padding: 40px;
            color: #ffffff;
          }

          .robots-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .add-robot-link {
            background-color: #1c7ed6;
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }

          .add-robot-link:hover {
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

        <div className="robots-container">
          <div className="robots-header">
            <h2>All Robots</h2>
            <Link to="/addRobot" className="add-robot-link">
              + Add Robot
            </Link>
          </div>

          {selectedRobot && (
            <EditRobot
              robot={selectedRobot}
              onClose={() => setSelectedRobot(null)}
              onUpdated={fetchRobots}
            />
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>IP address</th>
                <th>UUID</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {robots.map((robot) => (
                <tr key={robot._id}>
                  <td>{robot.reference}</td>
                  <td>{robot.ipAddress}</td>
                  <td>{robot.uuid}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => setSelectedRobot(robot)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteRobot(robot._id)}
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

export default RobotList;
