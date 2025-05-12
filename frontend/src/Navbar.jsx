// Navbar.jsx (Redesigned)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaHome, FaLayerGroup, FaLightbulb } from "react-icons/fa";

const Navbar = ({ username = "Guest", color = "#ffffff",password="default" }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [theme, setTheme] = useState({
        background: "",
        text: "",
        hover: ""
    });

    // Calculate if a color is light or dark
    const isLightColor = (hex) => {
        // Convert hex to RGB
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        
        // Calculate luminance (perceived brightness)
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5;
    };

    useEffect(() => {
        // Generate contrasting theme based on user color preference
        const isDark = isLightColor(color);
        
        setTheme({
            background: isDark ? "#1a1a2e" : "#f7f9f9",
            text: isDark ? "#ffffff" : "#1a1a2e",
            hover: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
            accentLight: isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
            shadow: isDark ? "0 4px 20px rgba(0, 0, 0, 0.4)" : "0 4px 20px rgba(0, 0, 0, 0.1)",
            dropdownBg: isDark ? "#16213e" : "#ffffff",
            dropdownBorder: isDark ? "#0f3460" : "#e0e0e0"
        });
    }, [color]);

    const handleLogout = async () => {
        try {
            console.log("Logging out...");
            await axios.get(`${apiUrl}/logout`, { withCredentials: true });
            navigate("/");
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Define a NavLink component for consistent styling
    const NavLink = ({ to, icon, label }) => (
        <button 
            onClick={() => navigate(to, { state: { username, color } })}
            style={{ 
                display: "flex", 
                alignItems: "center", 
                padding: "10px 20px", 
                background: "transparent", 
                border: "none", 
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                color: color,
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginRight: "6px"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = theme.hover;
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {icon}
            <span style={{ marginLeft: "8px" }}>{label}</span>
        </button>
    );

    return (
        <div className="navbar" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "12px 24px",
            backgroundColor: theme.background,
            color: theme.text,
            fontFamily: "'Poppins', 'Segoe UI', sans-serif",
            boxShadow: theme.shadow,
            borderRadius: "0 0 16px 16px",
            position: "relative",
            transition: "all 0.3s ease"
        }}>
            {/* Decorative elements inspired by imissmylibrary.com */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${color} 0%, #e0e0e0 50%, ${color} 100%)`,
                borderRadius: "4px 4px 0 0",
                opacity: 0.8
            }}></div>
            
            <div style={{ 
                display: "flex", 
                gap: "4px",
                alignItems: "center"
            }}>
                <div style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginRight: "28px",
                    color: color,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <span style={{
                        background: color,
                        color: isLightColor(color) ? "#1a1a2e" : "#ffffff",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        fontSize: "18px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>N</span>
                    Notely
                </div>
                
                <NavLink 
                    to="/notes" 
                    icon={<FaHome style={{ fontSize: "18px" }} />} 
                    label="Home" 
                />
                
                <NavLink 
                    to="/categories" 
                    icon={<FaLayerGroup style={{ fontSize: "18px" }} />} 
                    label="Categories" 
                />
                
                <NavLink 
                    to="/thoughts" 
                    icon={<FaLightbulb style={{ fontSize: "18px" }} />} 
                    label="Thoughts" 
                />
            </div>

            <div style={{ position: "relative" }}>
                <button 
                    onClick={toggleDropdown}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        padding: "8px 16px", 
                        background: "transparent", 
                        border: `2px solid ${color}`,
                        borderRadius: "30px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: color,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = color;
                        e.currentTarget.style.color = isLightColor(color) ? "#1a1a2e" : "#ffffff";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = color;
                    }}
                >
                    <FaUserCircle style={{ marginRight: "8px", fontSize: "18px" }} />
                    {username}
                </button>

                {dropdownOpen && (
                    <div style={{
                        position: "absolute",
                        right: 0,
                        backgroundColor: theme.dropdownBg,
                        border: `1px solid ${theme.dropdownBorder}`,
                        borderRadius: "16px",
                        boxShadow: theme.shadow,
                        zIndex: 100,
                        overflow: "hidden",
                        width: "220px",
                        marginTop: "8px",
                        animation: "fadeIn 0.2s ease-in-out",
                    }}>
                        <div style={{
                            padding: "16px",
                            borderBottom: `1px solid ${theme.dropdownBorder}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "50%",
                                backgroundColor: color,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "12px",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: isLightColor(color) ? "#1a1a2e" : "#ffffff"
                            }}>
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: theme.accentLight }}>Signed in as</p>
                            <p style={{ margin: 0, fontWeight: "bold", color: color, fontSize: "16px" }}>{username}</p>
                        </div>
                        
                        <div style={{ padding: "12px" }}>
                            <button 
                                onClick={() => navigate("/profile", { state: { username,password, color } })}
                                style={{ 
                                    width: "100%", 
                                    textAlign: "left", 
                                    padding: "12px", 
                                    background: "transparent", 
                                    border: "none", 
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    color: theme.text,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s",
                                    marginBottom: "4px"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                Profile
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    width: "100%", 
                                    textAlign: "left", 
                                    padding: "12px", 
                                    background: "transparent", 
                                    border: "none", 
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    color: theme.text,
                                    cursor: "pointer",
                                    transition: "background-color 0.2s"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;