import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Switch from "react-switch";
import axios from "axios";
import Report from "./Report";

function View() {
    const { uuid } = useParams();
    const [isRunning, setIsRunning] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isRunning ? "stop" : "start";

            await axios.post(
                `http://localhost:5001/cmdApi/${uuid}/${endpoint}`,
                {}, // empty body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsRunning(!isRunning);
        } catch (error) {
            console.error("Toggle failed:", error.response?.data || error.message);
            alert(
                "Failed to toggle robot. " +
                (error.response?.data?.message || "Check server logs for details.")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div className="layout">
            <Sidebar />
            <div className="content">
                <div className="commands">
                    <h2>Start / Stop Robot</h2>
                    <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                        <span style={{ fontWeight: "bold" }}>{isRunning ? "ON" : "OFF"}</span>
                        <Switch
                            onChange={handleToggle}
                            checked={isRunning}
                            onColor="#25b85b"
                            offColor="#e41919"
                            uncheckedIcon={false}
                            checkedIcon={false}
                            disabled={loading} // prevent rapid clicks
                        />
                    </label>
                    <h2>Robot report</h2>
                    <Report/>
                </div>
            </div>
        </div>
    );
}

export default View;