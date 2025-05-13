const express=require('express');
const session = require("express-session");
const mysql=require('mysql');
const cors=require('cors');
const router=express.Router()
const app=express();

const db = require("./db");

const frontendUrl=process.env.frontendUrl;
console.log(frontendUrl)
app.use(
    cors({
      origin:frontendUrl , // Allow frontend
      credentials: true, // Allow cookies/sessions
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    })
  );
app.use(express.json());
app.use(express.urlencoded({extended:true}),)
app.use(
  session({
    secret: "top_secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,           // Must be true for HTTPS
      httpOnly: true,
      sameSite: 'none',       // Must be 'none' for cross-origin cookies
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

const loginRouter=require('./routes/login.js')
app.use("/",loginRouter)
const registerRouter=require('./routes/register.js')
app.use("/",registerRouter)
const thoughtcatrouter=require('./routes/thoughtsundercategory.js')
app.use("/thoughtsundercategory",thoughtcatrouter) 
const catRouter=require('./routes/categories.js')
app.use("/categories",catRouter)
const thoughtRouter=require('./routes/thoughts.js')
app.use("/thoughts",thoughtRouter)

const passwordRouter=require('./routes/forgotpassword.js')
app.use("/forgotpassword",passwordRouter)
const profile=require('./routes/profile.js')
app.use("/profile",profile)


app.listen(1235);