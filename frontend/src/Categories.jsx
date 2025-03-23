import React,{useEffect, useState} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Categories=()=>{
    const navigate = useNavigate();
    const [data,getData]=useState('');
    const [cat,getCat]=useState('');
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:1234/logout", { withCredentials: true });
            
        } catch (error) {
            console.log("Logout failed", error);
        }
    }
    const get_data=async()=>{
        try{
            const response=await axios.get(("http://localhost:1234/categories"), { withCredentials: true });
            console.log("Session Response:", response.data);
            getData(response.data);

        }catch (error) {
            console.log("Session Check Failed", error);
            
        }
    }
    const postCat= async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:1234/categories/",
                { cat },
                { withCredentials: true } 
            );
            console.log(response.data);
        } catch (error) {
            console.log("Login Error:", error);
        }
    };
    useEffect(()=>{
        get_data();
    },[])
    return(
        <div>
            <div className="navbar">
                <button onClick={()=>{
                    navigate("/categories");
                }}>
                    Categories
                </button>
                <button onClick={()=>{
                    navigate("/thoughts");
                }}>
                    Thoughts
                </button>
                <button onClick={()=>{
                    handleLogout();
                    navigate("/");
                }}>
                    Logout
                </button>
            </div>
            <div className="cats">
                <div>
                    {data}
                </div>
               <div>
                <form onSubmit={postCat}>
                    <input type="text" placeholder='Type in category' onChange={(e) => getCat(e.target.value)} />
                    <button type="submit">
                        Enter
                    </button>
                </form>
                </div>
               
            </div>
        </div>
    )
}
export default Categories;