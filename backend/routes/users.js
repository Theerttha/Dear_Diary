const express=require('express')
const router=express.Router()
router.get('/',(reg,res)=>{
    res.send('users')
})
router
.route("/:x")
.get((req,res)=>{
    res.send(req.params.x)
})
router.param("x",(req,res,next,id)=>{
    next()

})
module.exports=router