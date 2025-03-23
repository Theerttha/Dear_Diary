import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginstatus, setLogin] = useState(null);
    const navigate = useNavigate();
    const handleSub = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:1234/register/",
                { username, password },
                { withCredentials: true } 
            );
            console.log(response.data);
            setLogin(response.data);
        } catch (error) {
            console.log("Login Error:", error);
        }
    };

    return (
        <div className="main">
            {loginstatus ===null && (
                <form onSubmit={handleSub}>
                    <label>
                        <h1>Username</h1>
                    </label>
                    <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                    <label>
                        <h1>Password</h1>
                    </label>
                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" onClick={()=>{
                        navigate("/")
                    }}>Register</button>
                </form>
            )}

            {loginstatus === 0 &&(
                <div>
                 <div>Username exists</div>
                 <form onSubmit={handleSub}>
                 <label>
                     <h1>Username</h1>
                 </label>
                 <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                 <label>
                     <h1>Password</h1>
                 </label>
                 <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                 <button type="submit">Register</button>
                 </form>
                </div>
             
             )}
            
        </div>
    );
};

export default Register;

