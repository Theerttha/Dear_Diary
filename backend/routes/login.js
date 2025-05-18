const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql2');
const db = require("../db");
const bcrypt=require("bcryptjs");

router.route('/login')

.get((req,res)=>{
    console.log("get in loginjs");
    if(req.user){
        return res.json(req.session.user.username);
    }
    return res.json(null); 
})
.post(async(req,res)=>{
    console.log("post in loginjs");
    db.query("Create table if not exists userDetails(sl int primary key auto_increment,username varchar(20) unique,password varchar(50),dob date,color varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Select password,color from userDetails where username like ?";
    db.query(sql,[req.body.username],async(err,data)=>{
        if (err) return res.json(0);
        else{
            if (data.length>0){
                const isValid=await bcrypt.compare(req.body.password,data[0].password);
                if (!isValid){
                    return res.json(-1);
                }
                else{
                    req.session.user={username:req.body.username};
                    console.log(req.session.user);
                    return res.json(data[0].color);
                }
                
            }
                
        }
    return res.json(-2);
            
        
})
})
router.route('/logout')
.get((req,res)=>{
    console.log("session",req.session.user.username);
    req.session.user={username:null};
    return res.json("Logged out successfully")
})
module.exports=router;