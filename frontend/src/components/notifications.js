import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const API_URL = "http://localhost:5001/notifApi";

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bell} onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </div>

      {open && (
        <div style={styles.dropdown}>
          <h4 style={styles.title}>Notifications</h4>

          {notifications.length === 0 ? (
            <p style={styles.empty}>No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                style={{
                  ...styles.notification,
                  backgroundColor: notif.isRead ? "#fff" : "#d1ecf1",
                }}
              >
                <span
                  style={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif._id);
                  }}
                >
                  ❌
                </span>

                <div onClick={() => markAsRead(notif._id)}>
                  <strong>{notif.type}</strong>
                  <p>{notif.message}</p>
                  <small>
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: "relative",
    cursor: "pointer",
  },
  bell: {
    fontSize: "24px",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "red",
    color: "white",
    borderRadius: "50%",
    padding: "4px 7px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "40px",
    width: "300px",
    maxHeight: "400px",
    overflowY: "auto",
    background: "white",
    color: "black",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)",
    padding: "10px",
    zIndex: 1000,
  },
  title: {
    marginBottom: "10px",
  },
  notification: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
    position: "relative",
  },
  deleteBtn: {
    position: "absolute",
    top: "5px",
    right: "8px",
    fontSize: "14px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    color: "gray",
  },
};

export default Notifications;