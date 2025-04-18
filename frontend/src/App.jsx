import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Notes from "./Notes";
import Categories from "./Categories";
import Thoughts from "./Thoughts";

import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/thoughts" element={<Thoughts />} />
                <Route path="/categories" element={<Categories />} />

                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;

  /*
  const[data,setData]=useState([]);
  useEffect(()=>{
    fetch('http://localhost:3000/')
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
      setData(data);
  })
    .catch(err=>console.log(err));
  },[]);
  return (
    <div className='main'>
      {data.map((d,i)=>(
        <h2 key={i}>
          {d.name}
          
        </h2>
      ))}
      
    </div>
  );
  */

