import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css"; // We'll create this CSS file separately

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginstatus, setLogin] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [color, setColor] = useState("#ffffff");
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const handleSub = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/login`,
                { username, password },
                { withCredentials: true } 
            );
            console.log(response.data);
            
            if (response.data === -1) {
                setErrorMessage("Incorrect password. Please try again.");
                setLogin(0);
            } else if (response.data === -2) {
                setErrorMessage("Username doesn't exist. Please register first.");
                setLogin(0);
            } else if (response.data === null || response.data === 0) {
                setLogin(null);
            } else {
                setColor(response.data);
                setLogin(1);
            }
        } catch (error) {
            console.log("Login Error:", error);
            setErrorMessage("An error occurred. Please try again.");
            setLogin(0);
        }
    };

    const checkSession = async () => {
        try {
            console.log((`${apiUrl}/login`));
            const response = await axios.get(`${apiUrl}/login`, { withCredentials: true });
            console.log("Session Response:", response.data);

            if (response.data == null || response.data === 0) {
                console.log("response.data", response.data);
                setLogin(null);
            } else {
                console.log("response", response.data);
                setLogin(1);
            }
        } catch (error) {
            console.log("Session Check Failed", error);
            setLogin(null);
        }
    };

    const handleLogout = async () => {
        setLogin(null);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/logout`, { withCredentials: true });
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (loginstatus === 1) {
            navigate("/notes", { state: { username: username, password: password, color: color } });
        }
    }, [loginstatus, navigate, username, password, color]);

    return (
        <div className="login-container">
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
            
            <div className="login-box">
                <h1 className="login-title">LOGIN</h1>
                
                {(loginstatus === null || loginstatus === 0) && (
                    <div className="login-form-container">
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                        
                        <form onSubmit={handleSub} className="login-form">
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} 
                                />
                            </div>
                            <div className="loginButtonBox">
                                <button type="submit" className="login-button">Login</button>
                            </div>
                            
                        </form>

                        <div className="register-section">
                            <div>
                                <span>If not registered</span>
                                <button 
                                    onClick={() => navigate("/register")} 
                                    className="register-button"
                                >
                                    Register
                                </button>
                            </div>

                        </div>

                        <div className="forgot-password">
                            <a href="#" onClick={() => navigate("/forgotpassword")}>
                                Forgot Password?
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;