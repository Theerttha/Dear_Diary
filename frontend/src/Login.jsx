import React from 'react'

const Login = () => {
  return (
    <div className="main">
        <form action="\" method="post">
        <label>
            <h>
                Username
            </h>
        </label>
        <input type="text" name="username"></input>
        <label>
            <h>
                Password
            </h>
        </label>
        <input type="text" name="password"></input>
        <button type="submit">Register</button>
        </form>

      
    </div>
  )
}

export default Login