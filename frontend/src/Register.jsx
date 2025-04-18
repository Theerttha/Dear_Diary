import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favouriteColour, setFavouriteColour] = useState("#000000");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const navigate = useNavigate();

  const handleSub = async (event) => {
    event.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:1234/register/",
        { username, password, favouriteColour, dob },
        { withCredentials: true }
      );
      console.log(response.data);
      
      // Check if the response indicates username exists
      if (response.data === 0) {
        setMessage("Username already exists. Please choose a different username.");
        setMessageType("error");
      } else {
        setMessage("Registration successful! Redirecting to login...");
        setMessageType("success");
        
        // Wait a moment before redirecting to give user time to see the success message
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.log("Registration Error:", error);
      setMessage("Registration failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div style={{ 
      maxWidth: "600px", 
      margin: "0 auto", 
      padding: "20px" 
    }}>
      <h2 style={{ 
        textAlign: "center", 
        marginBottom: "30px" 
      }}>Register Account</h2>
      
      {message && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: messageType === "error" ? "#ffebee" : "#e8f5e9",
          color: messageType === "error" ? "#c62828" : "#2e7d32",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ddd", 
        borderRadius: "5px",
        backgroundColor: "#f9f9f9"
      }}>
        <form onSubmit={handleSub}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Username
            </label>
            <input 
              type="text" 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
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
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
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
              Confirm Password
            </label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
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
              value={dob}
              onChange={(e) => setDob(e.target.value)} 
              required 
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
                name="favouriteColour"
                value={favouriteColour}
                onChange={(e) => setFavouriteColour(e.target.value)}
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
                name="favouriteColourText"
                value={favouriteColour}
                onChange={(e) => setFavouriteColour(e.target.value)}
                style={{ 
                  flex: "1",
                  padding: "8px", 
                  borderRadius: "4px",
                  border: "1px solid #ddd"
                }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button 
              type="submit"
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#2196f3", 
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Register
            </button>
            
            <button 
              type="button"
              onClick={() => navigate("/")}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#f5f5f5", 
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;