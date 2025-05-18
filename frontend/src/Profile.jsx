import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// Function to determine if a color is dark
const isColorDark = (hexColor) => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance (perceived brightness)
  // Formula: 0.299r + 0.587g + 0.114b
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // If luminance is less than 0.5, color is considered dark
  return luminance < 0.5;
};

// Function to generate a color palette based on base color
const generateTheme = (baseColor) => {
  const isDark = isColorDark(baseColor);
  
  // Create variations of the base color
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  // Lighten for secondary (or darken if base is light)
  const adjustFactor = isDark ? 40 : -40;
  const secondaryR = Math.min(255, Math.max(0, r + adjustFactor));
  const secondaryG = Math.min(255, Math.max(0, g + adjustFactor));
  const secondaryB = Math.min(255, Math.max(0, b + adjustFactor));
  
  const secondary = `#${secondaryR.toString(16).padStart(2, '0')}${secondaryG.toString(16).padStart(2, '0')}${secondaryB.toString(16).padStart(2, '0')}`;
  
  // Create an even lighter/darker variant for accents
  const accentAdjust = isDark ? 80 : -20;
  const accentR = Math.min(255, Math.max(0, r + accentAdjust));
  const accentG = Math.min(255, Math.max(0, g + accentAdjust));
  const accentB = Math.min(255, Math.max(0, b + accentAdjust));
  
  const accent = `#${accentR.toString(16).padStart(2, '0')}${accentG.toString(16).padStart(2, '0')}${accentB.toString(16).padStart(2, '0')}`;
  
  // Text and background colors based on base color brightness
  const textColor = isDark ? "#FFFFFF" : "#333333";
  const backgroundColor = isDark ? "#333333" : "#FFFFFF";
  const cardBg = isDark ? "#444444" : "#F8F8F8";
  const border = isDark ? "#555555" : "#E0E0E0";

  return {
    primary: baseColor,
    secondary: secondary,
    accent: accent,
    text: textColor,
    lightText: isDark ? "#CCCCCC" : "#666666",
    background: backgroundColor,
    cardBg: cardBg,
    success: isDark ? "#4CAF50" : "#388E3C",
    error: isDark ? "#FF5252" : "#D32F2F",
    border: border
  };
};

const Profile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
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
  
  // Generate theme based on color
  const themeColors = generateTheme(profile.color || color);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}/profile/`, {
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
        `${apiUrl}/profile/`,
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
  
  // Dynamically compute button and hover styles based on theme colors
  const buttonStyle = {
    padding: "14px 30px",
    backgroundColor: themeColors.primary,
    color: themeColors.text,
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
  };
  
  const cancelButtonStyle = {
    flex: "1",
    padding: "16px 24px",
    backgroundColor: themeColors.background,
    color: themeColors.text,
    border: `1px solid ${themeColors.border}`,
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
  };
  
  const saveButtonStyle = {
    flex: "1",
    padding: "16px 24px",
    backgroundColor: themeColors.primary,
    color: themeColors.text,
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    boxShadow: `0 4px 12px ${themeColors.primary}40`,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  };

  return (
    <div style={{
      background: `linear-gradient(to bottom, ${themeColors.primary}20, ${themeColors.background})`,
      minHeight: "100vh",
      color: themeColors.text,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <Navbar username={username} password={password} color={color} />
      <div style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <h2 style={{
          color: themeColors.text,
          borderBottom: `2px solid ${themeColors.border}`,
          paddingBottom: "15px",
          marginBottom: "30px",
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "600",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          position: "relative"
        }}>
          Profile
          <div style={{
            width: "100px",
            height: "2px",
            background: `linear-gradient(to right, transparent, ${themeColors.primary}, transparent)`,
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
              backgroundColor: messageType === "error" ? `${themeColors.error}20` : `${themeColors.success}20`,
              color: messageType === "error" ? themeColors.error : themeColors.success,
              borderRadius: "10px",
              marginBottom: "25px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              display: "flex",
              alignItems: "center",
              border: `1px solid ${messageType === "error" ? `${themeColors.error}40` : `${themeColors.success}40`}`
            }}
          >
            <span style={{ marginRight: "12px", fontSize: "20px" }}>
              {messageType === "error" ? "⚠️" : "✅"}
            </span>
            {message}
          </div>
        )}

        <div style={{
          padding: "30px",
          border: `1px solid ${themeColors.border}`,
          borderRadius: "15px",
          backgroundColor: themeColors.cardBg,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden"
        }}>
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
                    background: `${themeColors.background}80`,
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
                    background: `${themeColors.background}80`,
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
                    background: `${themeColors.background}80`,
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
                    background: `${themeColors.background}80`,
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
                  style={buttonStyle}
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
                      backgroundColor: `${themeColors.background}80`,
                      color: themeColors.text,
                      boxSizing: "border-box"
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
                        backgroundColor: `${themeColors.background}80`,
                        color: themeColors.text,
                        boxSizing: "border-box"
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
                      backgroundColor: `${themeColors.background}80`,
                      color: themeColors.text,
                      boxSizing: "border-box"
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
                    backgroundColor: `${themeColors.background}80`,
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
                        backgroundColor: "transparent",
                        color: themeColors.text
                      }}
                    />
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  gap: "15px",
                  marginTop: "10px",
                  flexDirection: window.innerWidth < 768 ? "column" : "row"
                }}>
                  <button
                    type="submit"
                    style={saveButtonStyle}
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
                    style={cancelButtonStyle}
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

// Media queries for responsive design
const mediaStyles = `
@media screen and (max-width: 768px) {
  .profile {
    padding: 15px !important;
  }
  
  h2 {
    font-size: 24px !important;
  }
  
  form input, 
  form div[style*="display: flex"],
  div[style*="padding: 12px 15px"] {
    font-size: 16px !important;
  }
  
  button {
    padding: 12px 20px !important;
    font-size: 14px !important;
  }
}

@media screen and (max-width: 480px) {
  .profile {
    padding: 10px !important;
  }
  
  h2 {
    font-size: 20px !important;
  }
  
  form input,
  form div[style*="display: flex"],
  div[style*="padding: 12px 15px"] {
    font-size: 14px !important;
    padding: 10px !important;
  }
  
  button {
    padding: 10px 15px !important;
    font-size: 14px !important;
  }
}
`;

// Add media queries to document
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(mediaStyles));
document.head.appendChild(style);

export default Profile;