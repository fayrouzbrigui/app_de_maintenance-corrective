import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";

function CameraCharts({ uuid }) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/cameraApi/camera/${uuid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(res.data)) return;
        const formattedData = res.data.map(item => ({
          ...item,
          lastUpdate: new Date(item.lastUpdate).toLocaleTimeString(),
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching Camera data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate, uuid]);

  return (
    <div style={{ padding: "20px" }}>
      {/* Embedded CSS */}
      <style>
        {`
          .charts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .chart-item {
            flex: 1 1 calc(50% - 20px); /* two charts per row */
            min-width: 300px;
            height: 250px;
          }
          @media (max-width: 768px) {
            .chart-item {
              flex: 1 1 100%;
            }
          }
          h3 {
            margin-bottom: 20px;
          }
        `}
      </style>

      <h3>Camera Charts</h3>
      <div className="charts-container">
        {/* Focus - Line */}
        <div className="chart-item">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="focus" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Brightness - Area */}
        <div className="chart-item">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="brightness" stroke="#c8c216" fill="#c8c21633" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Contrast - Line */}
        <div className="chart-item">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="contrast" stroke="#db3c23" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Noise - Bar */}
        <div className="chart-item">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="noise" fill="#3acd8b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FPS - Area */}
        <div className="chart-item">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="fps" stroke="#dc90d5" fill="#dc90d533" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CameraCharts;