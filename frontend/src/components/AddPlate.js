import React, {useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

const BASE_URL = "http://localhost:5001/plateApi";

function AddPlate({onPlateAdded}){
    const [form, setForm] = useState({
        plateText: "",
        status: "unkown"
    });

    function handleChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e){
        e.preventDefault();

        try {
            await axios.post(BASE_URL + "add_plate", form, {
                headers:{
                    Authorization: "Bearer" + localStorage.getItem("token")
                },
            });

            alert("Plate added successfully");
            setForm({plateText:"", status:"unkown"});
            onPlateAdded();

        } catch (error) {
            alert(error.response?.data?.message || "Failed to create plate");
        }
    }

    return(
        <div className="layout">
        <Sidebar />

        <div className="add-container">
          <div style={{ display: "flex", flexDirection: "column", width: "360px" }}>
            <Link to="/platesList" className="back-link">
              ← Back to Plates
            </Link>

            <form className="add-form" onSubmit={handleSubmit}>
              <h2>Add Plate</h2>

              <input
                name="plateText"
                placeholder="add plate number"
                value={form.plateText}
                onChange={handleChange}
              />

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="allowed">Allowed</option>
                <option value="denied">Denied</option>
                <option value="unkown">unkown</option>
              </select>

              <button type="submit">Add Plate</button>
            </form>
          </div>
        </div>
      </div>
    );
}

export default AddPlate;