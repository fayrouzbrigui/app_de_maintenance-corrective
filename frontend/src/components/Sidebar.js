import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {FaUsers, FaRobot, FaSignOutAlt, FaTachometerAlt, FaUserTie} from "react-icons/fa";

function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <>
      <style>
        {`
          .sidebar {
            width: 240px;
            background-color: #000000;
            color: #ffffff;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-shadow: 2px 0 10px rgba(0, 0, 0, 0.6);
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 40px;
            color: white;
          }

          .sidebar-menu {
            flex: 1;
          }

          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            color: #ffffff;
            text-decoration: none;
            opacity: 0.85;
            transition: background 0.2s, opacity 0.2s;
          }

          .sidebar-link:hover {
            background-color: #0b132b;
            opacity: 1;
          }

          .sidebar-link svg {
            font-size: 18px;
            color: white;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 10px;
            border-radius: 8px;
            background: red;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 15px;
            opacity: 0.85;
            align-text : center;
          }

          .logout-btn:hover {
            background-color: rgba(224, 49, 49, 0.15);
            opacity: 1;
          }

          .logout-btn svg {
            font-size: 18px;
          }
        `}
      </style>

      <aside className="sidebar">
        <div className="logo">
          <FaTachometerAlt />
          Dashboard
        </div>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className="sidebar-link">
            <FaTachometerAlt />
            Dashboard
          </Link>

          <Link to="/usersList" className="sidebar-link">
            <FaUsers />
            Users
          </Link>

          <Link to="/robotsList" className="sidebar-link">
            <FaRobot />
            Robots
          </Link>

       <Link to="/addMember" className="sidebar-link">
           <FaUserTie />
           Members
         </Link>

          
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Sign Out
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
