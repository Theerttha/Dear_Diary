const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()
const mysql=require('mysql');
const db = require("../db");
const bcrypt=require("bcryptjs");
router.route('/')
.get((req,res)=>{
    const sql="SELECT username,dob,color FROM userdetails WHERE username=?"
    db.query(sql,req.session.user.username,(err,result)=>{
        if(err) return res.status(500).json(err);
        if(result.length>0){
            console.log("res",result);
            return res.status(200).json(result);
        }
        else{
            return res.status(404).json("User not found")
        }
    })
    
})
.put(async(req,res)=>{
    const sql="UPDATE userdetails SET dob=?,color=?,password=?,username=? WHERE username=?"
    const newPassword=await bcrypt.hash(req.body.password,11);
    db.query(sql,[req.body.dob,req.body.color,newPassword,req.body.username,req.session.user.username],(err,result)=>{
        console.log(err)
        if(err) return res.json(0);
        console.log(result)
        if(result.affectedRows>0){
            req.session.user.username=req.body.username;
            return res.status(200).json("Updated successfully")
        }
        else{
            return res.status(404).json("User not found")
        }
    })
})
module.exports=router;