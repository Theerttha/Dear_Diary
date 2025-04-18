require("dotenv").config();
const mysql=require('mysql');
const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"test1"
})
module.exports=db;