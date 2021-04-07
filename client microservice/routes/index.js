const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const express= require("express")
const middleware = require('../middlewares/index')

const router  = express.Router()

// on authentication user's username is send over response
router.get('/',middleware.isAuthenticated,(user,req,res,next)=>{
    res.send("Welcome "+user.username)
})

/** callback to parse jwt and create cookie for the jwt if jwt is verified
    and redirect to /
    jwt verifies token with secret key
    on expiry, invalid user or signature, sends Unauthorized status
**/
router.post('/callback/:jwt',(req,res)=>{
  jwt.verify(req.params.jwt, process.env.SECRET,(err,user)=>{
    if( !err &&
        user.issuer==process.env.ISSUER &&
        bcrypt.compareSync(process.env.SIGNATURE,user.signature)
    ){
      res.cookie("jwt",req.params.jwt,{httpOnly:true, secure:true})
      res.redirect("/")
    }
    else {
      res.status(401).send("Unauthorized")
    }
  })
})

module.exports=router
