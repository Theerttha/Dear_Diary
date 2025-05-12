import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginstatus, setLogin] = useState(null);
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
            console.log(response.data)
            if (response.data===null || response.data==0){
                setLogin(null);
                
            }
            else{
                setColor(response.data);
                setLogin(1);
                
            }
        } catch (error) {
            console.log("Login Error:", error);
        }
    };

    const checkSession = async () => {
        try {
            console.log((`${apiUrl}/login`))
            const response = await axios.get(`${apiUrl}/login`, { withCredentials: true });
            console.log("Session Response:", response.data);
;
            if (response.data == null || response.data==0) {
                console.log("response.data",response.data);
                setLogin(null);
            } else {
                console.log("response",response.data);
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
            navigate("/notes", { state: { username: username,password:password,color:color} });
        }
    }, [loginstatus, navigate]);

    console.log(loginstatus);

    return (
        <div className="main">
            {loginstatus === null && (
                <div>
                    <form onSubmit={handleSub}>
                        <label>
                            <h1>Username</h1>
                        </label>
                        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                        <label>
                            <h1>Password</h1>
                        </label>
                        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Login</button>
                    </form>

                    <div>
                        If not registered
                        <button onClick={() => navigate("/register")}>Register</button>
                    </div>

                    <div>
                        <button onClick={() => navigate("/forgotpassword")}>Forgot Password?</button>
                    </div>
                </div>
            )}

            {loginstatus === 0 && (
                <div>
                    <div>Login Failed</div>
                    <form onSubmit={handleSub}>
                        <label>
                            <h1>Username</h1>
                        </label>
                        <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                        <label>
                            <h1>Password</h1>
                        </label>
                        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                        <button type="submit">Login</button>
                    </form>

                    <div>
                        If not registered
                        <button onClick={() => navigate("/register")}>Register</button>
                    </div>

                    <div>
                        <button onClick={() => navigate("/forgotpassword")}>Forgot Password?</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
