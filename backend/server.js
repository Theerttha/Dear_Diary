const express=require('express')
const mysql=require('mysql')
const cors=require('cors')
const app=express()
const user=require('./routes/users')
app.set("view engine", "ejs")
app.use(cors())
app.use(express.urlencoded({extended:true}))

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Vanilla333#",
    database:"test1"
})
app
.route("/")
.get((req,res)=>{
    const sql="Select * from user_details";
    db.query(sql,(err,data)=>{
        if(err){
            return res.json(err);
        }
        else{
            return res.json(data);
        }
    })
})

app.use('/users',user)
app.listen(3000)