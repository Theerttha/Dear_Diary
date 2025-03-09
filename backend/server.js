const express=require('express');

//onsole.log(express);
const mysql=require('mysql');
//Console.log(mysql);
const cors=require('cors');
const app=express();
app.use(express.json());

app.use(cors());
app.use(express.urlencoded({extended:true}));

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
.post((req,res)=>{
    const sql="Select * from user_details";
    const values=[req.body.username,req.body.password]
    
    db.query(sql,[req.body.username,req.body.password],(err,data)=>{
        if (err) return res.json(0);
        else{
            flag=0;
            data.forEach((user,sl) => {
                
                if (user.username==req.body.username && user.pass==req.body.password){
                    flag=1;
                }
                
            });
            if(flag==1){
                return res.json(1);
            }
            return res.json(0);
            
        }}
    )
})

app.listen(1234);