const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");
router.route('/')
.post((req,res)=>{
    console.log(req.body);
    const sql="Select * from user_details where username like ? and dob like ? and color like ?";
    db.query(sql,[req.body.username, req.body.dob, req.body.favouriteColour],(err,data)=>{
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
.put((req,res)=>{
    const sql="update user_details set pass=? where username like ?";
    console.log(req.body.newPassword)
    db.query(sql,[req.body.newPassword,req.body.username],(err,result)=>{
        if (err) return res.json(0);
        else{
            return res.json({success:1});
        }
})})
module.exports=router;