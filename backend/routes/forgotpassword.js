const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");
const bcrypt=require("bcryptjs")
router.route('/')
.post((req,res)=>{

    const sql="Select * from userDetails where username like ? and dob like ?";
    db.query(sql,[req.body.username, req.body.dob],(err,data)=>{
        console.log(data);
        if (err) return res.json(0);
        else{
            if (data.length>0){
                console.log({success:"true"});
                return res.json({success:"true"});
            }
            else{
                return res.json(0);
            }
        }
    })
})
router.route('/resetpassword')
.put(async(req,res)=>{
    const sql="update userDetails set password=? where username like ?";
    const hashedPassword=await bcrypt.hash(req.body.newPassword,11);
    db.query(sql,[hashedPassword,req.body.username],(err,result)=>{
        if (err) return res.json(0);
        else{
            return res.json({success:1});
        }
})})
module.exports=router;