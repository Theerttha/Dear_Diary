import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || "Guest");
  const [color, setColor] = useState(location.state?.color || "#4CAF50");
  const [password, setPassword] = useState(location.state?.password || "default");
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    dob: "",
    color: "",
    password: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Enchanted forest theme colors
  const themeColors = {
    primary: "#2E7D32", // Deep forest green
    secondary: "#1B5E20", // Darker green
    accent: "#8BC34A", // Light leafy green
    highlight: "#FFEB3B", // Magical yellow glow
    text: "#2D3748", // Deep charcoal
    lightText: "#4A5568",
    background: "#F0F9EF", // Light misty background
    cardBg: "#FFFFFF",
    success: "#1B5E20",
    error: "#B71C1C",
    border: "#C6F6D5" // Light green border
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/profile/`, {
        withCredentials: true,
      });
      
      // Format the date from ISO to YYYY-MM-DD for input element
      const userData = response.data[0];
      if (userData?.dob) {
        const date = new Date(userData.dob);
        const formattedDate = date.toLocaleDateString('en-CA'); // outputs YYYY-MM-DD
        userData.dob = formattedDate;
      }
      
      // Ensure password is maintained in the profile state
      userData.password = password;
      
      setProfile(userData || {});
    } catch (error) {
      console.log("Error fetching profile", error);
      showMessage("Error loading profile data", "error");
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const startEditing = () => {
    setIsEditing(true);
    setUpdatedProfile({
      username: profile.username,
      dob: profile.dob,
      color: profile.color,
      password: password // Use the current password from state
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setUpdatedProfile({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        "http://localhost:1234/profile/",
        updatedProfile,
        { withCredentials: true }
      );
      
      if(response.data === 0){
        showMessage("Username already exists. Please choose a different username.", "error");
        return;
      }
      
      setIsEditing(false);
      setUsername(updatedProfile.username);
      setColor(updatedProfile.color);
      setPassword(updatedProfile.password); // Update password state
      
      showMessage("Profile updated successfully!");
      
      // Fetch updated profile data
      fetchProfile();
      
    } catch (error) {
      console.log("Error updating profile:", error);
      showMessage("Error updating profile", "error");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div style={{ 
      background: `linear-gradient(to bottom, ${themeColors.background}, #FFFFFF)`,
      minHeight: "100vh"
    }}>
      <Navbar username={username} password={password} color={color} />
      <div className="profile" style={{ 
        padding: "30px", 
        maxWidth: "800px", 
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <h2 style={{ 
          color: themeColors.primary, 
          borderBottom: `2px solid ${themeColors.border}`, 
          paddingBottom: "15px",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "600",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          position: "relative"
        }}>
          Enchanted Profile
          <div style={{
            width: "100px",
            height: "2px",
            background: `linear-gradient(to right, transparent, ${themeColors.highlight}, transparent)`,
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: "translateX(-50%)"
          }}></div>
        </h2>
        
        {message && (
          <div 
            style={{ 
              padding: "16px 20px", 
              backgroundColor: messageType === "error" ? "#FDECEA" : "#E8F5E9",
              color: messageType === "error" ? themeColors.error : themeColors.success,
              borderRadius: "10px",
              marginBottom: "25px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              border: `1px solid ${messageType === "error" ? "#FFCDD2" : "#C8E6C9"}`
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "20px" }}>
              {messageType === "error" ? "⚠️" : "✨"}
            </span>
            {message}
          </div>
        )}

        <div style={{ 
          padding: "40px", 
          border: `1px solid ${themeColors.border}`, 
          borderRadius: "15px",
          backgroundColor: themeColors.cardBg,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          background: "linear-gradient(145deg, #FFFFFF, #F9FFF7)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Decorative elements inspired by enchanted forest */}
          <div style={{
            position: "absolute",
            top: "0",
            right: "0",
            width: "150px",
            height: "150px",
            background: `radial-gradient(circle, ${themeColors.border}30, transparent 70%)`,
            zIndex: "0",
            borderRadius: "50%"
          }}></div>
          
          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            width: "100px",
            height: "100px",
            background: `radial-gradient(circle, ${themeColors.border}20, transparent 70%)`,
            zIndex: "0",
            borderRadius: "50%"
          }}></div>
          
          <div style={{ position: "relative", zIndex: "1" }}>
            {!isEditing ? (
              <>
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ 
                    marginBottom: "10px", 
                    color: themeColors.lightText, 
                    fontSize: "16px", 
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Username</h3>
                  <p style={{ 
                    fontSize: "20px", 
                    fontWeight: "600",
                    color: themeColors.text,
                    padding: "12px 15px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }}>{profile.username}</p>
                </div>
                
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ 
                    marginBottom: "10px", 
                    color: themeColors.lightText, 
                    fontSize: "16px", 
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Password</h3>
                  <div style={{ 
                    position: "relative",
                    padding: "12px 15px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <p style={{ 
                      fontSize: "20px", 
                      fontWeight: "600",
                      color: themeColors.text,
                      letterSpacing: "2px",
                      margin: "0"
                    }}>
                      {showPassword ? password : "•".repeat(Math.max(8, password?.length || 8))}
                    </p>
                    <button 
                      onClick={togglePasswordVisibility}
                      style={{
                        background: `${themeColors.accent}20`,
                        border: "none",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "50%",
                        color: themeColors.primary,
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div style={{ marginBottom: "30px" }}>
                  <h3 style={{ 
                    marginBottom: "10px", 
                    color: themeColors.lightText, 
                    fontSize: "16px", 
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Date of Birth</h3>
                  <p style={{ 
                    fontSize: "20px", 
                    fontWeight: "600",
                    color: themeColors.text,
                    padding: "12px 15px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  }}>{profile.dob}</p>
                </div>
                
                <div style={{ marginBottom: "40px" }}>
                  <h3 style={{ 
                    marginBottom: "10px", 
                    color: themeColors.lightText, 
                    fontSize: "16px", 
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>Theme</h3>
                  <div style={{ 
                    padding: "12px 15px",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "8px",
                    border: `1px solid ${themeColors.border}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                    display: "flex", 
                    alignItems: "center" 
                  }}>
                    <div 
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        backgroundColor: profile.color || "#2E7D32",
                        marginRight: "15px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        transition: "transform 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseOver={(e) => e.target.style.transform = "scale(1.1)"}
                      onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                    />
                    <span style={{ 
                      fontSize: "20px", 
                      fontWeight: "600",
                      color: themeColors.text
                    }}>{profile.color}</span>
                  </div>
                </div>
                
                <button 
                  onClick={startEditing}
                  style={{ 
                    padding: "14px 30px", 
                    backgroundColor: themeColors.primary, 
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    boxShadow: `0 4px 12px ${themeColors.primary}50`,
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = themeColors.secondary;
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = themeColors.primary;
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={saveProfile}>
                <div style={{ marginBottom: "25px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "10px", 
                    fontWeight: "500",
                    color: themeColors.lightText,
                    fontSize: "15px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={updatedProfile.username || ""}
                    onChange={handleChange}
                    style={{ 
                      width: "100%", 
                      padding: "15px", 
                      borderRadius: "10px",
                      border: `1px solid ${themeColors.border}`,
                      fontSize: "16px",
                      transition: "all 0.2s ease",
                      outline: "none",
                      backgroundColor: "rgba(255,255,255,0.7)"
                    }}
                    onFocus={(e) => {
                      e.target.style.border = `1px solid ${themeColors.accent}`;
                      e.target.style.boxShadow = `0 0 0 3px ${themeColors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.border = `1px solid ${themeColors.border}`;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "25px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "10px", 
                    fontWeight: "500",
                    color: themeColors.lightText,
                    fontSize: "15px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={updatedProfile.password || ""}
                      onChange={handleChange}
                      style={{ 
                        width: "100%", 
                        padding: "15px", 
                        paddingRight: "50px",
                        borderRadius: "10px",
                        border: `1px solid ${themeColors.border}`,
                        fontSize: "16px",
                        transition: "all 0.2s ease",
                        outline: "none",
                        backgroundColor: "rgba(255,255,255,0.7)"
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `1px solid ${themeColors.accent}`;
                        e.target.style.boxShadow = `0 0 0 3px ${themeColors.accent}30`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `1px solid ${themeColors.border}`;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "15px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: `${themeColors.accent}20`,
                        border: "none",
                        borderRadius: "50%",
                        width: "36px",
                        height: "36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: themeColors.primary,
                        transition: "all 0.2s ease"
                      }}
                      onMouseOver={(e) => e.target.style.background = `${themeColors.accent}40`}
                      onMouseOut={(e) => e.target.style.background = `${themeColors.accent}20`}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div style={{ marginBottom: "25px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "10px", 
                    fontWeight: "500",
                    color: themeColors.lightText,
                    fontSize: "15px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={updatedProfile.dob || ""}
                    onChange={handleChange}
                    style={{ 
                      width: "100%", 
                      padding: "15px", 
                      borderRadius: "10px",
                      border: `1px solid ${themeColors.border}`,
                      fontSize: "16px",
                      transition: "all 0.2s ease",
                      outline: "none",
                      backgroundColor: "rgba(255,255,255,0.7)"
                    }}
                    onFocus={(e) => {
                      e.target.style.border = `1px solid ${themeColors.accent}`;
                      e.target.style.boxShadow = `0 0 0 3px ${themeColors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.border = `1px solid ${themeColors.border}`;
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: "35px" }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "10px", 
                    fontWeight: "500",
                    color: themeColors.lightText,
                    fontSize: "15px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>
                    Theme
                  </label>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center",
                    borderRadius: "10px",
                    overflow: "hidden",
                    border: `1px solid ${themeColors.border}`,
                    backgroundColor: "rgba(255,255,255,0.7)"
                  }}>
                    <input
                      type="color"
                      name="color"
                      value={updatedProfile.color || "#2E7D32"}
                      onChange={handleChange}
                      style={{ 
                        width: "60px", 
                        height: "48px", 
                        padding: "0", 
                        border: "none",
                        borderRight: `1px solid ${themeColors.border}`,
                        cursor: "pointer",
                        backgroundColor: "transparent"
                      }}
                    />
                    <input
                      type="text"
                      name="color"
                      value={updatedProfile.color || ""}
                      onChange={handleChange}
                      style={{ 
                        flex: "1",
                        padding: "15px", 
                        border: "none",
                        fontSize: "16px",
                        outline: "none",
                        backgroundColor: "transparent"
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  gap: "15px",
                  marginTop: "10px" 
                }}>
                  <button 
                    type="submit"
                    style={{ 
                      flex: "1",
                      padding: "16px 24px", 
                      backgroundColor: themeColors.accent, 
                      color: "white",
                      border: "none",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: `0 4px 12px ${themeColors.accent}40`,
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#7CB342";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = themeColors.accent;
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={cancelEditing}
                    style={{ 
                      flex: "1",
                      padding: "16px 24px", 
                      backgroundColor: "#F5F5F5", 
                      color: themeColors.text,
                      border: `1px solid #E0E0E0`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px"
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#EEEEEE";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#F5F5F5";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;