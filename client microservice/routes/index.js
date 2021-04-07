const express= require("express")
const middleware = require('../middlewares/index')

const router  = express.Router()

router.get('/',middleware.isAuthenticated,(user,req,res,next)=>{
    res.send("Welcome "+user.username)
})

router.post('/callback/:jwt',(req,res)=>{
  res.cookie("jwt",req.params.jwt,{httpOnly:true, secure:true})
  res.redirect("/")
})

module.exports=router
