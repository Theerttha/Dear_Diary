import React, { useEffect, useState} from 'react'
import Login from './Login.jsx';
function App() {
  return(
    <div>
      <Login />
    </div>
    
  )
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
}


export default App
