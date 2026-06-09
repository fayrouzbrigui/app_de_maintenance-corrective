import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { useNavigate } from "react-router-dom";

function LidarCharts({ uuid }) {
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
        const res = await axios.get(
          `http://localhost:5001/lidarsApi/lidar/${uuid}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!Array.isArray(res.data)) {
          console.error("Expected array but got:", res.data);
          return;
        }

        const formattedData = res.data
          .slice(-100) // 🔥 safety limit
          .map((item) => ({
            ...item,
            lastUpdate: new Date(item.lastUpdate).toLocaleTimeString(),
          }));

        setData(formattedData);

      } catch (error) {
        console.error("Error fetching Lidar data:", error);
      }
    };

    fetchData();

    // 🔥 reduce load (optional: 10s instead of 5s)
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [navigate, uuid]);

  return (
    <div className="lidar-charts-wrapper" style={{ padding: "20px" }}>
      <style>
        {`
          .charts-container {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .chart-item {
            flex: 1 1 calc(50% - 20px);
            min-width: 300px;
            height: 250px;
          }
          @media (max-width: 768px) {
            .chart-item {
              flex: 1 1 100%;
            }
          }
        `}
      </style>

      <h3>Lidar Charts</h3>

      <div className="charts-container">
        <div className="chart-item">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="lastDistance" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="temperature" stroke="#c8c216" fill="#c8c21633" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="signalStrength" fill="#db3c23" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minDistance" stroke="#e5b0da" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="maxDistance" stroke="#cae822" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item">
          <ResponsiveContainer>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lastUpdate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="averageDistance" stroke="#87c0cd" fill="#87c0cd33" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default LidarCharts;