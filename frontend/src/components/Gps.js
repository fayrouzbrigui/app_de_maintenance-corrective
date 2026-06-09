import { useEffect, useState } from "react";
import axios from "axios";
import {Line, LineChart, Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import { useNavigate } from "react-router-dom";

function GpsCharts({uuid}){
    const [data, setData] = useState([]);
    const navigate = useNavigate()

    useEffect(() =>{
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
            return;
        }

        const fetchData = async () =>{
            try {
                
                const res = await axios.get(`http://localhost:5001/gpsApi/gps/${uuid}`, {
                    headers : {Authorization : `Bearer ${token}`},
                });

                console.log(res)

                if(!Array.isArray(res.data)){
                    console.error("expected array but got: ", res.data);
                    return;
                }

                const formattedData = res.data.map((item) =>({
                    ...item,
                    lastUpdate : new Date(item.lastUpdate).toLocaleTimeString(),

                }));

                setData(formattedData);
            } catch (error) {
                console.error("error fetching gps data: ", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [navigate, uuid]);

    return (
        <div className="gps-charts-wrapper" style={{padding: "20px"}}>
            <style>{`

                .charts-container{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px
                }

                .chart-item{
                    flex: 1 1 calc(50% - 20px);
                    min-width: 300px;
                    height: 250px;
                }

                @media(max-width: 768px){
                    .chart-item{
                        flex : 1 1 100%;
                    }
                }

            `}</style>

            <h3>GPS Charts</h3>
            <div className="charts-container">
                <div className="chart-item">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{top: 10, right: 30, bottom: 0, left: 0}}>
                            <CartesianGrid strokeDasharray= "3 3"/>
                            <XAxis dataKey="lastUpdate" />
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="latitude" stroke="#1a659f" dot={false}/>

                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-item">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{tpo: 10, right: 30, bottom: 0, left: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="lastUpdate"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey="longitude" stroke="#075a71" dot={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-item">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{top: 10, right: 30, bottom: 0, left: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="lastUpdate"/>
                            <YAxis/>
                            <Tooltip/>
                            <Bar dataKey="num_satellites" fill="#caec94"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default GpsCharts;