import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || "Guest");
  const [color, setColor] = useState(location.state?.color || "#ffffff");
  const [profile, setProfile] = useState({
    username: "",
    dob: "",
    color: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const [message, setMessage] = useState("");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:1234/profile/`, {
        withCredentials: true,
      });
      console.log("Profile data:", response.data[0]);
      
      // Format the date from ISO to YYYY-MM-DD for input element
      const userData = response.data[0];
      if (userData?.dob) {
        const date = new Date(userData.dob);
        const formattedDate = date.toLocaleDateString('en-CA'); // outputs YYYY-MM-DD
        userData.dob = formattedDate;
      }
      setProfile(userData || {});
    } catch (error) {
      console.log("Error fetching profile", error);
      setMessage("Error loading profile data");
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setUpdatedProfile({
      username: profile.username,
      dob: profile.dob,
      color: profile.color
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

  const saveProfile = async (e) => {
    e.preventDefault();
    console.log(updatedProfile)
    try {
      const response=await axios.put(
        "http://localhost:1234/profile/",
        updatedProfile,
        { withCredentials: true }
      );
      if(response.data === 0){
        setMessage("Username already exists. Please choose a different username.");
        return;
      }
      setIsEditing(false);
      setUsername(updatedProfile.username);
      setColor(updatedProfile.color);
      setMessage("Profile updated successfully!");
      
      fetchProfile();
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.log("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      <Navbar username={username} color={color} />
      <div className="profile" style={{ padding: "20px" }}>
        <h2>My Profile</h2>
        
        {message && (
          <div 
            style={{ 
              padding: "10px", 
              backgroundColor: message.includes("Error") ? "#ffebee" : "#e8f5e9",
              color: message.includes("Error") ? "#c62828" : "#2e7d32",
              borderRadius: "4px",
              marginBottom: "20px"
            }}
          >
            {message}
          </div>
        )}

        <div style={{ 
          padding: "20px", 
          border: "1px solid #ddd", 
          borderRadius: "5px",
          backgroundColor: "#f9f9f9"
        }}>
          {!isEditing ? (
            <>
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ marginBottom: "5px" }}>Username</h3>
                <p>{profile.username}</p>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ marginBottom: "5px" }}>Date of Birth</h3>
                <p>{profile.dob}</p>
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ marginBottom: "5px" }}>Favorite Color</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div 
                    style={{ 
                      width: "20px", 
                      height: "20px", 
                      backgroundColor: profile.color || "#ccc",
                      marginRight: "10px",
                      border: "1px solid #ddd"
                    }} 
                  />
                  <span>{profile.color}</span>
                </div>
              </div>
              
              <button 
                onClick={startEditing}
                style={{ 
                  padding: "8px 16px", 
                  backgroundColor: "#2196f3", 
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={saveProfile}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={updatedProfile.username || ""}
                  onChange={handleChange}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={updatedProfile.dob || ""}
                  onChange={handleChange}
                  style={{ 
                    width: "100%", 
                    padding: "8px", 
                    borderRadius: "4px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Favorite Color
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="color"
                    name="color"
                    value={updatedProfile.color || "#000000"}
                    onChange={handleChange}
                    style={{ 
                      width: "50px", 
                      height: "40px", 
                      padding: "0", 
                      border: "1px solid #ddd",
                      marginRight: "10px"
                    }}
                  />
                  <input
                    type="text"
                    name="color"
                    value={updatedProfile.color || ""}
                    onChange={handleChange}
                    style={{ 
                      flex: "1",
                      padding: "8px", 
                      borderRadius: "4px",
                      border: "1px solid #ddd"
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button 
                  type="submit"
                  style={{ 
                    padding: "8px 16px", 
                    backgroundColor: "#4caf50", 
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Save
                </button>
                <button 
                  type="button"
                  onClick={cancelEditing}
                  style={{ 
                    padding: "8px 16px", 
                    backgroundColor: "#f44336", 
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;