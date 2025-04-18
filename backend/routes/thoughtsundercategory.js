const express=require('express');

const cors=require('cors');
const session = require("express-session");
const router=express.Router()

const mysql=require('mysql');
const db = require("../db");

router.route('/')
.get((req,res)=>{
    console.log("thoughtsundercategory"+req.session.user.username);
    const sql="Select id, thought from thoughts where id in(Select thoughtid from cat_thoughts where categoryid=?)";
    db.query(sql,[req.query.id],(err,results)=>{
        if(err){
            console.error(err);
            return res.json(0);
        }
        console.log(results);
        res.json(results);
    })
})
.post((req,res)=>{
    thoughtid=-1;
    const sql="Insert into thoughts(thought,userid,updatetime) values(?,?,now())";    
    db.query(sql,[req.body.thought,req.session.user.username],(err,result)=>{
    if(err){
        console.error("Error inserting data:", err);
        
    }
    else{
        console.log("resultid:",result.insertId);
        thoughtid=result.insertId;
        console.log(thoughtid)
        const sql1="Insert into cat_thoughts(thoughtid,categoryid) values(?,?)";
        db.query(sql1,[thoughtid,req.body.id],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })  
    }})

    
})
.put((req,res)=>{
    console.log("update");
    const sql="update thoughts set thought=? where id=?"
    db.query(sql,[req.body.thought,req.body.id],(err,result)=>{
        if(err){
            console.error("Error inserting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })
})
router.route("/:id")
.delete((req,res)=>{
    console.log("delete");
    const sql="delete from cat_thoughts where thoughtid=?"
    db.query(sql,[req.params.id],(err,result)=>{
        if(err){
            console.error("Error deleting data:", err);
            return res.json(0);
        }
        return res.json(1);
    })

})
module.exports=router;