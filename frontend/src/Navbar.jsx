// Navbar.jsx (Responsive with Hamburger Menu)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle, FaHome, FaLayerGroup, FaLightbulb, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ username = "Guest", color = "#ffffff", password = "default" }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
            dropdownBorder: isDark ? "#0f3460" : "#e0e0e0",
            mobileMenuBg: isDark ? "#16213e" : "#ffffff"
        });
    }, [color]);

    useEffect(() => {
        // Track window resize for responsive behavior
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // Close mobile menu if screen gets resized to larger size
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        // Close mobile menu if dropdown is toggled
        if (windowWidth <= 768) {
            setMobileMenuOpen(false);
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        // Close dropdown if mobile menu is toggled
        if (dropdownOpen) {
            setDropdownOpen(false);
        }
    };

    // Define a NavLink component for consistent styling
    const NavLink = ({ to, icon, label, isMobile = false }) => (
        <button 
            onClick={() => {
                navigate(to, { state: { username, color } });
                if (isMobile) setMobileMenuOpen(false);
            }}
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
                marginRight: isMobile ? 0 : "6px",
                width: isMobile ? "100%" : "auto",
                justifyContent: isMobile ? "flex-start" : "center"
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
            transition: "all 0.3s ease",
            zIndex: 1000
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
                alignItems: "center",
                justifyContent: "flex-start",
                flex: 1
            }}>
                {/* App Logo and Title */}
                <div style={{
                    fontSize: windowWidth <= 768 ? "18px" : "22px",
                    fontWeight: "700",
                    marginRight: windowWidth <= 768 ? "auto" : "28px",
                    color: color,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <span style={{
                        background: color,
                        color: isLightColor(color) ? "#1a1a2e" : "#ffffff",
                        width: windowWidth <= 768 ? "28px" : "32px",
                        height: windowWidth <= 768 ? "28px" : "32px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "12px",
                        fontSize: windowWidth <= 768 ? "16px" : "18px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                    }}>D</span>
                    Dear Diary
                </div>
                
                {/* Desktop Navigation Links */}
                {windowWidth > 768 && (
                    <>
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
                    </>
                )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            {windowWidth <= 768 && (
                <button
                    onClick={toggleMobileMenu}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: color,
                        fontSize: "24px",
                        cursor: "pointer",
                        marginRight: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px"
                    }}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}

            {/* User Profile Button */}
            <div style={{ position: "relative" }}>
                <button 
                    onClick={toggleDropdown}
                    style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        padding: windowWidth <= 768 ? "6px 12px" : "8px 16px", 
                        background: "transparent", 
                        border: `2px solid ${color}`,
                        borderRadius: "30px",
                        fontSize: windowWidth <= 768 ? "14px" : "16px",
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
                    <FaUserCircle style={{ marginRight: "8px", fontSize: windowWidth <= 768 ? "16px" : "18px" }} />
                    {windowWidth <= 480 ? username.charAt(0) : username}
                </button>

                {/* User Dropdown Menu */}
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
                                onClick={() => {
                                    navigate("/profile", { state: { username, password, color } });
                                    setDropdownOpen(false);
                                }}
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
                                onClick={() => {
                                    handleLogout();
                                    setDropdownOpen(false);
                                }}
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

            {/* Mobile Navigation Menu */}
            {windowWidth <= 768 && mobileMenuOpen && (
                <div style={{
                    position: "fixed",
                    top: "76px", // Height of navbar + border
                    left: 0,
                    right: 0,
                    backgroundColor: theme.mobileMenuBg,
                    boxShadow: theme.shadow,
                    zIndex: 99,
                    borderRadius: "0 0 16px 16px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    animation: "slideIn 0.3s ease-in-out",
                }}>
                    <NavLink 
                        to="/notes" 
                        icon={<FaHome style={{ fontSize: "18px" }} />} 
                        label="Home" 
                        isMobile={true}
                    />
                    
                    <NavLink 
                        to="/categories" 
                        icon={<FaLayerGroup style={{ fontSize: "18px" }} />} 
                        label="Categories" 
                        isMobile={true}
                    />
                    
                    <NavLink 
                        to="/thoughts" 
                        icon={<FaLightbulb style={{ fontSize: "18px" }} />} 
                        label="Thoughts" 
                        isMobile={true}
                    />
                    
                    <div style={{ 
                        height: "1px", 
                        backgroundColor: theme.dropdownBorder, 
                        margin: "8px 0" 
                    }}></div>
                    
                    <button 
                        onClick={() => {
                            navigate("/profile", { state: { username, password, color } });
                            setMobileMenuOpen(false);
                        }}
                        style={{ 
                            display: "flex",
                            alignItems: "center",
                            width: "100%", 
                            padding: "10px 20px", 
                            background: "transparent", 
                            border: "none", 
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            color: color,
                            cursor: "pointer",
                            transition: "background-color 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        <FaUserCircle style={{ marginRight: "8px", fontSize: "18px" }} />
                        Profile
                    </button>
                </div>
            )}

            {/* CSS animations */}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                /* Prevent scrolling when mobile menu is open */
                ${mobileMenuOpen ? 'body { overflow: hidden; }' : ''}
                `}
            </style>
        </div>
    );
};

export default Navbar;