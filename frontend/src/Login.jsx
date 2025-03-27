import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginstatus, setLogin] = useState(null);
    const [registerStatus,setRegister]=useState(null);
    const navigate = useNavigate();
    const handleSub = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:1234/login",
                { username, password },
                { withCredentials: true } 
            );
            console.log(response.data);
            setLogin(response.data);
        } catch (error) {
            console.log("Login Error:", error);
        }
    };

    const checkSession = async () => {
        try {
            const response = await axios.get("http://localhost:1234/login", { withCredentials: true });
            console.log("Session Response:", response.data);
            if (response.data===null){
                setLogin(null);
            }
            else {
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
            await axios.post("http://localhost:1234/logout", { withCredentials: true });
            
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    useEffect(() => {
        checkSession();
    }, []); 
    useEffect(() => {
        if (loginstatus === 1) {
            navigate("/notes"); // ✅ Redirect when loginstatus is 1
        }
    }, [loginstatus, navigate]);
    console.log(loginstatus);
    return (
        <div className="main">
            {loginstatus ===null && (
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
                            <button  onClick={() => navigate("/register")}>Register</button>
                        </div>
                    

                </div>
            )}


            {loginstatus === 0 &&(
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
                    <button  onClick={() => navigate("/register")}>Register</button>
                    </div>
                </div>
        
             )}

        </div>
    );
};

export default Login;
