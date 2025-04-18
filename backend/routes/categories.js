const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");

router.route('/')

.get((req,res)=>{
    
    console.log("categories"+req.session.user.username);
    db.query("create table if not exists categories(id int primary key auto_increment,category varchar(20),userid varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Select id, category from categories where userid=?";
    db.query(sql,(req.session.user.username),(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.post((req,res)=>{
    console.log("categories post "+req.session);
    db.query("create table if not exists categories(id int primary key auto_increment,category varchar(20),userid varchar(20));"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="Insert into categories(category,userid) values(?,?)";
    console.log(req.session.user);
    console.log(req.body.cat);
    db.query(sql,[req.body.cat,req.session.user.username],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
router.route("/:id")
.get((req,res)=>{

    const sql="Select id, thought from thoughts where id in(Select thoughtid from cat_thoughts where categoryid=?);";
    db.query(sql,[req.params.id],(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.put((req,res)=>{
    console.log(req.params.sl);
    const sql="update categories set category=? where id=?"
    db.query(sql,[req.body.cat,req.params.id],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
.delete((req,res)=>{
    console.log("delete");
    const sql="delete from categories where id=?"
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        
    }
    )
    const sqlConnect="delete from cat_thoughts where categoryid=?";
    db.query(sqlConnect,[req.params.id],(err,result)=>{ 
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        return res.json(1);
    }   )
})
router.route('/:catid/thoughts/:thoughtid')
.delete((req,res)=>{
    console.log("put");
    const sql="delete from cat_thoughts where categoryid=? and thoughtid=?";
    db.query(sql,[req.params.catid,req.params.thoughtid],(err,result)=>{
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
}   )
module.exports=router;