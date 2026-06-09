import React,{ useState } from "react";
import axios from "axios";
import {Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const PostImage = () =>{
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if(!name || !image){
            alert("provide image and name");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        try {
            setLoading(true);
            
            await axios.post("http://localhost:5001/membersApi/postImage", formData, {
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
            });

            alert("member created successfully!");
            navigate("/membersList");
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert("Upload failed"); 
        } finally{
            setLoading(false);
        }
    };

    return(
        <div className="layout">
            <Sidebar />
            <div className="add-container">
                <div style={{display: "flex", flexDirection: "column", width: "360px"}}>
                    <Link to="/membersList" className="back-link">
                        Back To Members List
                    </Link>

                    <form className="add-form" onSubmit={handleSubmit}>
                        <h2>Add Member</h2>
                        <input type="text" placeholder="Member Name" value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])}/>
                        <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Member"}</button>
                    </form>
                </div>
            </div>
        </div>

    )


}

export default PostImage;
