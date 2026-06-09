import { useParams } from "react-router-dom";
import LidarCharts from "./Lidar";
import Sidebar from "./Sidebar";
import CameraCharts from "./Camera";
import { useRef } from "react";
import PcCharts from "./Pc";
import GpsCharts from "./Gps"

function Visualize(){
    const { uuid } = useParams();
    const lidarRef = useRef(null);
    const cameraRef = useRef(null);
    const pcRef = useRef(null);
    const gpsRef = useRef(null);

    const scrollToSection = (ref) =>{
        ref.current?.scrollIntoView({behavior : "smooth"});
    };

    return (
        <div className="container">
            
           
            <div className="layout">
            <style>
            {`
                .layout{
                    background-color: white;
                }
                
                .links {
                    display: flex;
                    flex-direction: row;
                    gap: 20px;
                    position: sticky;
                    padding-top: 5px;
                    top: 0;
                    z-index: 100;
                }

                .links button{
                    background-color: green;
                    color: white;
                    padding: 8px;
                    border-radius: 15px;
                    font-weight: bold;

                }

                .charts-wrapper {
                    flex: 1;        
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;            
                }
        `   }
            </style>
            <Sidebar />
            <div className="charts-wrapper ">
                <div className="links">
                    <button onClick={() => scrollToSection(lidarRef)}>Lidar Charts </button>
                    <button onClick={() => scrollToSection(cameraRef)}> Camera Charts </button>
                    <button onClick={() => scrollToSection(pcRef)}>PC Charts</button>
                    <button onClick={() => scrollToSection(gpsRef)}>GPS Charts</button>
                </div>
                <div ref={lidarRef}>
                    <LidarCharts uuid={uuid}  />
                </div>

                <div ref={cameraRef}>
                    <CameraCharts  uuid={uuid}  />
                </div>

                <div ref={pcRef}>
                    <PcCharts uuid={uuid}/>
                </div>

                <div ref={gpsRef}>
                    <GpsCharts uuid={uuid}/>
                </div>
            </div>
            
        </div>
        </div>
        
    )
}

export default Visualize;