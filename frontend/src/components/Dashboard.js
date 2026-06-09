import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import EditRobot from "./EditRobot";
import Notifications from "./notifications";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5001/robotsApi";

const Dashboard = () => {
  const [robots, setRobots] = useState([]);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const navigate = useNavigate();

  async function fetchRobots() {
    try {
      const res = await axios.get(BASE_URL + "/robots", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setRobots(res.data.data.robots);
    } catch (error) {
      console.error("Error fetching robots:", error);
    }
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
            color: #ffffff;
          }

          .robots-content {
            flex: 1;
            padding: 40px;
          }

          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .robots-header {
            font-size: 28px;
            font-weight: bold;
            color: white;
          }

          .robots-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }

          .robot-card {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            cursor: pointer;
          }

          .robot-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 20px rgba(28, 126, 214, 0.4);
          }

          .robot-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: black;
          }

          .robot-info {
            font-size: 14px;
            color: black;
            margin-bottom: 6px;
          }

          .card-actions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
          }

          .action-btn {
            flex: 1;
            padding: 6px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
          }

          .charts-btn {
            background-color: #168e97;
            color: #fff;
          }

          .view-btn {
            background-color: #078298;
            color: #fff;
          }

          .action-btn:hover {
            opacity: 0.9;
          }

          .empty-state {
            color: #cfd8dc;
            font-size: 14px;
          }
        `}
      </style>

      <div className="layout">
        <Sidebar />

        <div className="robots-content">

          <div className="header-row">
            <div className="robots-header">All Robots</div>
            <Notifications />
          </div>

          {selectedRobot && (
            <EditRobot
              robot={selectedRobot}
              onClose={() => setSelectedRobot(null)}
              onUpdated={fetchRobots}
            />
          )}

          {robots.length === 0 ? (
            <p className="empty-state">No robots found.</p>
          ) : (
            <div className="robots-grid">
              {robots.map((robot) => (
                <div
                  key={robot._id}
                  className="robot-card"
                >
                  <div className="robot-title">{robot.reference}</div>

                  <div className="robot-info">
                    <strong>IP:</strong> {robot.ipAddress}
                  </div>

                  <div className="robot-info">
                    <strong>UUID:</strong> {robot.uuid}
                  </div>

                  <div
                    className="card-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="action-btn charts-btn"
                      onClick={() => navigate(`/robots/${robot.uuid}`)}
                    >
                      Charts
                    </button>

                    <button
                      className="action-btn view-btn"
                      onClick={() => navigate(`/view/${robot.uuid}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;