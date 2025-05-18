import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forgotpassword.css"; // We'll create this CSS file separately

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(username, dob);
      const response = await axios.post(`${apiUrl}/forgotpassword`, {
        username,
        dob,
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
      const response = await axios.put(`${apiUrl}/forgotpassword/resetpassword`, {
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
    <div className="forgot-password-container">
      <div className="background-words">
        <div className="word">Memories</div>
        <div className="word">Journal</div>
        <div className="word">Thoughts</div>
        <div className="word">Dreams</div>
        <div className="word">Stories</div>
        <div className="word">Notes</div>
        <div className="word">Diary</div>
        <div className="word">Reflections</div>
        <div className="word">Moments</div>
        <div className="word">Secrets</div>
        <div className="word">Adventures</div>
        <div className="word">Feelings</div>
        <div className="word">Emotions</div>
        <div className="word">Chronicles</div>
        <div className="word">Confessions</div>
        <div className="word">Letters</div>
        <div className="word">Experiences</div>
        <div className="word">Ideas</div>
        <div className="word">Heart</div>
        <div className="word">Soul</div>
      </div>
      
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">FORGOT PASSWORD</h1>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="forgot-password-form-container">
          {!verified ? (
            // Step 1: Verify user identity
            <form onSubmit={handleSubmit} className="forgot-password-form">
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  required 
                />
              </div>

              <div className="button-group">
                <button 
                  type="submit"
                  className="verify-button"
                >
                  Verify Identity
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate("/")}
                  className="back-button"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            // Step 2: Reset password
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="button-group">
                <button 
                  type="submit"
                  className="reset-button"
                >
                  Reset Password
                </button>
                
                <button 
                  type="button"
                  onClick={() => navigate("/")}
                  className="cancel-button"
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

export default ForgotPassword;