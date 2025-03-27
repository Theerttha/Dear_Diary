const express=require('express');
const mysql=require('mysql');
const cors=require('cors');
const session = require("express-session");
const app=express();

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", // Allow frontend
      credentials: true, // Allow cookies/sessions
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
  );
app.use(express.urlencoded({extended:true}),)
app.use(
    session({
        secret:"top_secret",
        resave:false,
        saveUninitialized:true,
        cookie:{
            secure:false,
            httpOnly:true,
            maxAge:1000*60*60*24,
        },

    })
);
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

const db= mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Vanilla333#",
    database:"test1"
})
app
.route("/login")
.get((req,res)=>{
    if(req.user){
        console.log("/"+req.session.user.username);
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
    const sql="Select * from user_details where username like ? and pass like ?";
    db.query(sql,[req.body.username,req.body.password],(err,data)=>{
        if (err) return res.json(0);
        else{
            if (data.length>0){
                req.session.user={username:req.body.username};
                console.log(req.session.user);
                return res.json(1);
            }
                
        }
        return res.json(0);
            
        
})
})
app.route('/logout')
.post((req,res)=>{
    req.session.user={username:null};
})
app.route('/register')
.post((req,res)=>{
    db.query("Create table if not exists user_details(sl int primary key auto_increment,username varchar(20) unique,pass varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql = "INSERT INTO user_details (username, pass) VALUES (?, ?)";
    
    db.query(sql, [req.body.username, req.body.password], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    });
})
app.route('/categories')
.get((req,res)=>{
    db.query("create table if not exists categories(sl int primary key auto_increment,category varchar(20),userid varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Select category from categories where userid=?";
    db.query(sql,(req.session.user.username),(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.post((req,res)=>{
    db.query("create table if not exists categories(sl int primary key auto_increment,category varchar(20),userid varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Insert into categories(category,userid) values(?,?)";
    console.log(req.session.user.username);
    console.log(req.body.cat);
    db.query(sql,[req.body.cat,req.session.user.username],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
app.route('/thoughts')
.get((req,res)=>{
    db.query("create table if not exists thoughts(sl int primary key auto_increment,thought varchar(20),userid varchar(20),updatetime datetime);"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="SELECT thought,time(updatetime) as lasttime,DATE_FORMAT(updatetime, '%d-%m-%y') as lastdate FROM thoughts WHERE userid=? order by updatetime desc";
    db.query(sql,(req.session.user.username),(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.post((req,res)=>{
    db.query("create table if not exists thoughts(sl int primary key auto_increment,thought varchar(20),userid varchar(20),updatetime datetime);"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Insert into thoughts(thought,userid,updatetime) values(?,?,now())";
    console.log(req.session.user.username);
    console.log(req.body.thought);
    db.query(sql,[req.body.thought,req.session.user.username],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
app.listen(1234);