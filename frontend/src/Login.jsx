import React,{useState} from 'react'
import Res from './Res.jsx'
import axios from 'axios'
const Login = () => {
    const[username, setUsername]=useState('')
    const[password,setPassword]=useState('')
    const[loginstatus, setLogin]=useState(null)
    function handleSub(event){
        event.preventDefault();

        axios.post("http://localhost:1234/",{username,password})
        .then(res=>{
            console.log(res.data);
            if (res.data==1){
                setLogin("success")

            }
            else{
                setLogin("fail")
                return(
                    <div>
                        <h>
                            couldn't
                        </h>
                    </div>
                )
            }
        })
        .catch(err=>console.log(err))

    }
  return (
    <div className="main">
        <form onSubmit={handleSub}>
        <label>
            <h>
                Username
            </h>
        </label>
        <input type="text" name="username" onChange={e=>setUsername(e.target.value)}></input>
        <label>
            <h>
                Password
            </h>
        </label>
        <input type="text" name="password" onChange={e=>setPassword(e.target.value)}></input>
        <button type="submit">Register</button>
        </form>
        {loginstatus=="success" &&(
            <div>
                <Res />
            </div>
                                
                            
        )}
    </div>
  )
}

export default Login