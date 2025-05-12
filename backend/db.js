require("dotenv").config();
const mysql=require('mysql');

const db= mysql.createConnection({
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database

  
})
db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

module.exports=db;