import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Thoughts=()=>{
    const navigate = useNavigate();
    const [TData, setTData] = useState([]); // Initialize as array
    const [newThought, setNewThought] = useState(""); // State for input
    const getThoughts=async()=>{
        try{
            const response=await axios.get("http://localhost:1234/thoughts",{withCredentials:true});
            console.log(response.data);
            setTData(response.data);
        } catch (error) {
            console.log("Error fetching categories", error);
          }
    }
    const postThought = async (event) => {
        event.preventDefault();
        try {
          await axios.post(
            "http://localhost:1234/thoughts/",
            { thought:newThought }, // ✅ Corrected payload
            { withCredentials: true }
          );
          setNewThought(""); // Clear input after submission
          getThoughts(); // ✅ Refresh categories list
        } catch (error) {
          console.log("Error adding category:", error);
        }
      };
    
      useEffect(() => {
        getThoughts();
      }, []);
      return (
        <div>
            <Navbar />
          <div className="thoughts">
            {/* ✅ Corrected Mapping */}
            <div>
              {Array.isArray(TData) ? (
                TData.map((item,index) => (
                  <div key={index}>
                    <div>
                    {item.thought}
                    </div>
                    <div>
                    {item.lasttime}
                    </div>
                    <div>
                    {item.lastdate}
                    </div>
                        
                        
                        
                                 
                    </div> // ✅ Access the `category` field
                ))
              ) : (
                <p>Loading thoughts...</p>
              )}
            </div>
    
            {/* Category Input Form */}
            <div>
              <form onSubmit={postThought}>
                <input 
                  type="text" 
                  value={newThought} // 
                  placeholder="Type in category"
                  onChange={(e) => setNewThought(e.target.value)}
                />
                <button type="submit">Enter</button>
              </form>
            </div>
          </div>
        </div>
      );
    };


export default Thoughts;