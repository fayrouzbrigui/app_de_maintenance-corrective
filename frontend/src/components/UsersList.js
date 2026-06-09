import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditUser from "./EditUser";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/usersApi";

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  async function fetchUsers() {
    const res = await axios.get(BASE_URL + "/users", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setUsers(res.data.data.users);
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(BASE_URL + "/users/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    fetchUsers();
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      {/* Inline CSS */}
      <style>
        {`
          .layout {
            display: flex;
            min-height: 100vh;
            background-color: #0b132b;
          }

          .users-container {
            flex: 1;
            padding: 40px;
            color: #ffffff;
          }

          .users-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .add-user-link {
            background-color: #1c7ed6;
            color: #ffffff;
            padding: 8px 14px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
          }

          .add-user-link:hover {
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
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="users-container">
          <div className="users-header">
            <h2>All Users</h2>
            <Link to="/addUser" className="add-user-link">
              + Add User
            </Link>
          </div>

          {selectedUser && (
            <EditUser
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onUpdated={fetchUsers}
            />
          )}

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => setSelectedUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => deleteUser(user._id)}
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

export default UserList;
