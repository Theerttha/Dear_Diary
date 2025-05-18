
const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql2');
const db = require("../db");
const bcrypt = require('bcryptjs');
router.route('/register')
.post(async(req,res)=>{
    console.log("post in register.js");
    db.query("Create table if not exists userDetails(sl int primary key auto_increment,username varchar(20) unique,password varchar(100),dob date,color varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const password=await bcrypt.hash(req.body.password,11);
    console.log("password hashed");
    const sql = "INSERT INTO userDetails (username, password, color,dob) VALUES (?,?,?,?)";
    db.query(sql, [req.body.username,password,req.body.favouriteColour,req.body.dob], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        console.log("Returning successfully");
        return res.json(1);
    });
    console.log('return failed');
})
module.exports=router;