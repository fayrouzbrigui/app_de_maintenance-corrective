import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const MembersGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_BASE = "http://localhost:5001/membersApi";

    // Fetch all images
    const fetchImages = async () => {
        try {
            const res = await axios.get(`${API_BASE}/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setImages(res.data);
        } catch (err) {
            console.error("❌ Fetch images error:", err);
            setError("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    // Delete image
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_BASE}/remove/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Remove from UI immediately
            setImages((prev) => prev.filter((img) => img._id !== id));
        } catch (err) {
            console.error("❌ Delete image error:", err);
            alert("Failed to delete image");
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    if (loading) return <p>Loading images...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (

        <div className="layout">
            <Sidebar />
            <div style={styles.container}>

                {images.length === 0 && <p>No images found</p>}

                <div style={styles.grid}>
                    {images.map((img) => (
                        
                        <div key={img._id} style={styles.card}>
                            
                            <img
                                src={`http://localhost:5001${img.imagePath}`}
                                alt={img.name}
                                style={styles.image}
                            />

                            <div style={styles.info}>
                                <span>{img.name}</span>

                                <button
                                    onClick={() => handleDelete(img._id)}
                                    style={styles.deleteBtn}
                                    title="Delete image"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: 'column'
    

    },
    grid: {
        display: "flex",
        alignItems: "center",
        flexDirection: 'raw',
        flexWrap: "wrap", 
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        margin: "5px",
        width: "23%",
    },
    image: {
        width: "100%",
        height: "180px",
        objectFit: "cover",
    },
    info: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 10px",
    },
    deleteBtn: {
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "18px",
    },

    h2:{
        color: "white",
        fontSize: "18px",
    }
};

export default MembersGallery;
