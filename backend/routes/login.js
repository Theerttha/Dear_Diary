const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");

router.route('/login')

.get((req,res)=>{
    if(req.user){
        return res.json(req.session.user.username);
    }
    return res.json(null); 
})
.post((req,res)=>{
    db.query("Create table if not exists user_details(sl int primary key auto_increment,username varchar(20) unique,pass varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Select color from user_details where username like ? and pass like ?";
    db.query(sql,[req.body.username,req.body.password],(err,data)=>{
        if (err) return res.json(0);
        else{
            if (data.length>0){
                req.session.user={username:req.body.username};
                console.log(req.session.user);
                return res.json(data[0].color);
            }
                
        }
        return res.json(0);
            
        
})
})
router.route('/logout')
.get((req,res)=>{
    console.log("session",req.session.user.username);
    req.session.user={username:null};
    return res.json("Logged out successfully")
})
module.exports=router;