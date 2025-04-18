const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");

router.route('/')
.get((req,res)=>{
    db.query("create table if not exists thoughts(id int primary key auto_increment,thought varchar(20),userid varchar(20),updatetime datetime);"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="SELECT id, thought,time(updatetime) as lasttime,DATE_FORMAT(updatetime, '%d-%m-%y') as lastdate FROM thoughts WHERE userid=? order by updatetime desc";
    db.query(sql,(req.session.user.username),(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.post((req,res)=>{
    db.query("create table if not exists thoughts(id int primary key auto_increment,thought varchar(20),userid varchar(20),updatetime datetime);"),(err,result)=>{
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
router.route('/:id')
.delete((req,res)=>{
    db.query("create table if not exists thoughts(id int primary key auto_increment,thought varchar(20),userid varchar(20),updatetime datetime);"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    
    const sql="delete from cat_thoughts where thoughtid=?";
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        const sql2="delete from thoughts where id=?";
        db.query(sql2,[req.params.id],(err,result)=>{
            if(err){
                console.error("Error deleting data:", err);
                return res.json(0);
            }
        })
        return res.json(1);
    })
})
.put((req,res)=>{
    const sql="Update thoughts set thought=? where id=?";

    db.query(sql,[req.body.thought,req.params.id],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })

})
router.route('/categories')
.get((req,res)=>{
    db.query("create table if not exists categories(id int primary key auto_increment,category varchar(20),thoughtid int);"),(err,result)=>{
        if(err){
            console.error("Error creating table:", err);
            return res.json(0);
        }
    }
    const sql="SELECT * from cat_thoughts;";
    db.query(sql,(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        res.json(results);
    })
})
.post((req,res)=>{
    const sql="Insert into cat_thoughts(categoryid,thoughtid) values(?,?)";
    db.query(sql,[req.body.categoryId,req.body.thoughtId],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
router.route('/categories/:linkId')
.delete((req,res)=>{
    const sql="delete from cat_thoughts where id=?";
    db.query(sql,[req.params.linkId],(err,result)=>{
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
module.exports=router;