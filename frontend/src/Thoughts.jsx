import React,{useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Thoughts=()=>{
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:1234/logout", { withCredentials: true });
            
        } catch (error) {
            console.log("Logout failed", error);
        }
    }
    return(
        <div>
            <div className="navbar">
                <button onClick={()=>{
                    navigate("/categories");
                }}>
                    Categories
                </button>
                <button onClick={()=>{
                    navigate("/thoughts");
                }}>
                    Thoughts
                </button>
                <button onClick={()=>{
                    handleLogout();
                    navigate("/");
                }}>
                    Logout
                </button>
            </div>

        </div>
    )
}
export default Thoughts;