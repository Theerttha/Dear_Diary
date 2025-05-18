import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css"; // We'll create this CSS file separately

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [favouriteColour, setFavouriteColour] = useState("#000000");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "error" or "success"
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
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
        `${apiUrl}/register`,
        { username, password, favouriteColour, dob },
        { withCredentials: true }
      );
      console.log(response.data);
      
      // Check if the response indicates username exists
      if (response.data === 0) {
        setMessage("Username already exists. Please choose a different username.");
        setMessageType("error");
      } else if(response.data === 1){
        setMessage("Registration successful! Redirecting to login...");
        setMessageType("success");
        
        // Wait a moment before redirecting to give user time to see the success message
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      else{
        console.log(response.data);
      }
    } catch (error) {
      console.log("Registration Error:", error);
      setMessage("Registration failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="register-container">
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
      
      <div className="register-box">
        <h1 className="register-title">REGISTER</h1>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSub} className="register-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              name="dob" 
              value={dob}
              onChange={(e) => setDob(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Favorite Color</label>
            <div className="color-selector">
              <input
                type="color"
                name="favouriteColour"
                value={favouriteColour}
                onChange={(e) => setFavouriteColour(e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                name="favouriteColourText"
                value={favouriteColour}
                onChange={(e) => setFavouriteColour(e.target.value)}
                className="color-text"
              />
            </div>
          </div>
          
          <div className="button-group">
            <button 
              type="submit"
              className="register-button"
            >
              Register
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
      </div>
    </div>
  );
};

export default Register;