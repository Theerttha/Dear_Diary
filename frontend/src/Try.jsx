import React, {useEffect, useState} from 'react'
import ReactDOM from "react-dom/client";

function Try(){
    const [num,setNum]=useState(null);
    const [x,setx]=useState(10);
    useEffect(()=>{
        setx(x-1);
    },[num])
    return(
        <div>
            <h>
            Num: {num}
            X: {x}
            </h>
            <button type="submit" onClick={()=>{
                if (num==null){
                    console.log("null");
                    setNum(0);
                }
                else{
                    setNum(num+1);
                }
            }}>
                Click to increment
            </button>
            
        </div>

    )
}
export default Try