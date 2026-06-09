import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Search() {
  const [robots, setRobots] = useState([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchRobots = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/robotsApi/robots",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const robotsArray = res.data?.data?.robots || [];
        setRobots(robotsArray);
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchRobots();
  }, [navigate]);

  // Filter robots dynamically
  const filteredRobots = robots.filter((robot) =>
    robot.reference
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const handleChange = (e) => {
    setSearch(e.target.value);
    setShowDropdown(true);
  };

  return (
    <>
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search robot..."
            value={search}
            onChange={handleChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            className="search-input"
          />

          {showDropdown && search && filteredRobots.length > 0 && (
            <div className="dropdown">
              {filteredRobots.map((robot) => (
                <div
                  key={robot.uuid}
                  onMouseDown={() =>
                    navigate(`/robots/${robot.uuid}`)
                  }
                  className="dropdown-item"
                >
                  {robot.reference}
                </div>
              ))}
            </div>
          )}

          {showDropdown && search && filteredRobots.length === 0 && (
            <div className="dropdown no-results">
              No robots found
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-container {
          display: flex;
          justify-content: center;
          align-items: center;
        } 
        .search-box {
          position: relative;
          width: 1000px;
        } 
        .search-input { width: 100%;
          padding: 12px 16px;
          border-radius: 25px;
          border: 1px solid #ccc;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-size: 16px;
          outline: none;
          transition: all 0.2s;
          border-radius: 25px;
        }
        
      .search-input:focus {
        border-color: #007BFF;
        box-shadow: 0 4px 12px rgba(0,123,255,0.2);
      }
      .dropdown {
       position: absolute;
       left: 15px;
       right: 0;
       border: 1px solid #ddd;
       background-color: white;
b       max-height: 200px;
       width: 100%;
    }
       
    .dropdown-item {
        padding: 12px 16px;
        cursor:pointer;
        border-bottom: 1px solid #eee;
        color: black;
    }

    .no-results {
        padding: 12px 16px;
        text-align: center;
        color: #999;
      }
      `}</style>
    </>
  );
}

export default Search;