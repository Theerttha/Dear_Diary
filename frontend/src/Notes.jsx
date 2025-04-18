// Notes.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Notes = () => {
    const location = useLocation();
    const [username, setUsername] = useState(location.state?.username || "Guest");
    const [color, setColor] = useState(location.state?.color || "#ffffff");



    return (
        <div>
            <Navbar username={username} color={color} />
            <h1>{username} - {color}</h1>
      
        </div>
    );
};

export default Notes;
