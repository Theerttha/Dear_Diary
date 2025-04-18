import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [favouriteColour, setFavouriteColour] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username, dob, favouriteColour);
      const response = await axios.post("http://localhost:1234/forgotpassword", {
        username,
        dob,
        favouriteColour,
        withCredentials: true,
      });
      
      console.log(response.data);
      if (response.data.success) {
        setVerified(true); // Show new password field
        setMessage("Verification successful! Please set a new password.");
        setMessageType("success");
      } else {
        setMessage("Verification failed. Please check your information and try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.log("Error during password recovery:", error);
      setMessage("Request failed. Please try again later.");
      setMessageType("error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      setMessageType("error");
      return;
    }
    
    try {
      const response = await axios.put("http://localhost:1234/forgotpassword/resetpassword", {
        username,
        newPassword,
        withCredentials: true,
      });
      
      if (response.data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setMessageType("success");
        
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        console.log("Error resetting password:", response.data);
        setMessage("Password reset failed. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.log("Error resetting password:", error);
      setMessage("Reset request failed. Please try again later.");
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
      }}>Forgot Password</h2>
      
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
        {!verified ? (
          // Step 1: Verify user identity
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Username
              </label>
              <input 
                type="text" 
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
                Date of Birth
              </label>
              <input 
                type="date" 
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
                  value={favouriteColour}
                  onChange={(e) => setFavouriteColour(e.target.value)}
                  required
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
                Verify Identity
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
        ) : (
          // Step 2: Reset password
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                New Password
              </label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
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
                Confirm New Password
              </label>
              <input 
                type="password" 
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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button 
                type="submit"
                style={{ 
                  padding: "10px 20px", 
                  backgroundColor: "#4caf50", 
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Reset Password
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
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;