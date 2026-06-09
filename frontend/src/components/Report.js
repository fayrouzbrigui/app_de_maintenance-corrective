import { useState } from "react";
import axios from "axios";

export default function Report() {

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getReport = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/reportApi/report",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReport(res.data);

    } catch (err) {

      if (err.response?.status === 401) {
        setError("Unauthorized: please login again");
      } else {
        setError("Failed to get robot report");
      }

    } finally {

      setLoading(false);

    }

  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>

      <h1>Robot Dashboard</h1>

      {/* BUTTON */}
      <button onClick={getReport}>
        Get Robot Report
      </button>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* ERROR */}
      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* REPORT */}
      {report && (
        <div
          style={{
            marginTop: 20,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        >

          <h3>Robot: {report.robotUuid}</h3>

          <p>
            Camera:{" "}
            <b>{report.camera}</b>
          </p>

          <p>
            LiDAR:{" "}
            <b>{report.lidar}</b>
          </p>

          <p>
            GPS:{" "}
            <b>{report.gps}</b>
          </p>

          <p>
            Time:{" "}
            {new Date(
              report.timestamp
            ).toLocaleString()}
          </p>

        </div>
      )}

    </div>
  );
}