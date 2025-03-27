import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
const Categories = () => {
  const navigate = useNavigate();
  const [CatData, setCatData] = useState([]); // Initialize as array
  const [newCategory, setNewCategory] = useState(""); // State for input


  const get_data = async () => {
    try {
      const response = await axios.get("http://localhost:1234/categories", { withCredentials: true });
      console.log("Fetched Categories:", response.data);
      setCatData(response.data); // ✅ Ensure setting as an array
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  };

  const postCat = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        "http://localhost:1234/categories/",
        { cat: newCategory }, // ✅ Corrected payload
        { withCredentials: true }
      );
      setNewCategory(""); // Clear input after submission
      get_data(); // ✅ Refresh categories list
    } catch (error) {
      console.log("Error adding category:", error);
    }
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <div>
        <Navbar />
      <div className="cats">
        {/* ✅ Corrected Mapping */}
        <div>
          {Array.isArray(CatData) ? (
            CatData.map((item, index) => (
              <div key={index}>{item.category}</div> // ✅ Access the `category` field
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>

        {/* Category Input Form */}
        <div>
          <form onSubmit={postCat}>
            <input 
              type="text" 
              value={newCategory} // 
              placeholder="Type in category"
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit">Enter</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Categories;
