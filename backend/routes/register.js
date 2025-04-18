const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");
router.route('/register')
.post((req,res)=>{
    db.query("Create table if not exists user_details(sl int primary key auto_increment,username varchar(20) unique,pass varchar(20),dob date,color varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql = "INSERT INTO user_details (username, pass, color,dob) VALUES (?, ?,?,?)";
    
    db.query(sql, [req.body.username, req.body.password,req.body.favouriteColour,req.body.dob], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    });
})
module.exports=router;