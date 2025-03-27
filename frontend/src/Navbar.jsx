import React from 'react'
import { useNavigate } from "react-router-dom";
const Navbar = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
        await axios.post("http://localhost:1234/logout", { withCredentials: true });
        } catch (error) {
        console.log("Logout failed", error);
        }
    };
    return (

        <div className="navbar">
            <button onClick={() => navigate("/categories")}>Categories</button>
            <button onClick={() => navigate("/thoughts")}>Thoughts</button>
            <button onClick={() => { handleLogout(); navigate("/"); }}>Logout</button>
        </div>
    )
}

export default Navbar
