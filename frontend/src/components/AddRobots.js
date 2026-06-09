import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/robotsApi";

function AddRobot({onRobotAdded}){
    const [form, setForm] = useState({
        reference: "",
        ipAddress: "",
        uuid: ""
    });

    function handleChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
           await axios.post(BASE_URL + "/create", form, {
            headers:{
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
           });

           alert("Robot created successfully!");
           setForm({reference: "", ipAddress: "", uuid: ""});
           onRobotAdded();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create robot");
        }
    }

    return(
      <div className="layout">
        <Sidebar />
        <div className="add-container">
            <div style={{ display: "flex", flexDirection: "column", width: "360px" }}>
                <Link to="/robotsList" className="back-link">
                              ← Back to Robots List
                </Link>
                <form className="add-form" onSubmit={handleSubmit}>
                    <h2>Add Robot</h2>
                    <input name="reference" placeholder="Enter the robot reference" value={form.reference} onChange={handleChange}/>
                    <input name="ipAddress" placeholder="Enter the robot IP address" value={form.ipAddress} onChange={handleChange}/>
                    <input name="uuid" placeholder="Enter the robot UUID" value={form.uuid} onChange={handleChange}/>
                    <button type="submit">Create Robot</button>
                </form>
            </div>
        </div>
      </div>
        
    );
}

export default AddRobot;