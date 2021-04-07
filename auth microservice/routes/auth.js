const express= require("express")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const url = require('url')
const router  = express.Router()

class Auth {
  static secret = process.env.SECRET  //secret key for jwt library
  static client_id = process.env.CLIENT_ID // client id identifier
  static redirect_uris = new Set([  // list of allowed redirect uris
    "http://localhost:5001/callback"
  ])
  static users ={ // dummy user
    'kanujdg3623':{
      displayName: "Kanuj Das Gupta",
      // hashed password using bcrypt
      passwordHash: "$2b$08$7QPqyj55vma0aKSfBRUPVOdY4L7llvGxXBs/bzxQaqVN0qzMrGYlK"
    }
  }
}

// renders login page->views/index.ejs
router.get("/",(req,res)=>{
  res.render("index",req.query)
})

/**
  check client id and redirect uri gotten through URL string
  bcrypts checks for password if correct for the given username
  jwt created with payload: username, issuer, hashed signature with 5 min expiry
  the jwt is sent to redirect uri
**/
router.post("/",(req,res)=>{
  let client_id = req.body.client_id
  let redirect_uri = req.body.redirect_uri
  let username = req.body.username
  let password = req.body.password
  if(client_id!=Auth.client_id)
    res.send("invalid client")
  else if(!Auth.redirect_uris.has(redirect_uri))
    res.send("invalid redirect uri")
  else if(!Auth.users[username])
    res.send("user doesn't exist")
  else if(!bcrypt.compareSync(password, Auth.users[username].passwordHash))
    res.send( "Password Incorrect")
  else{
    var token = jwt.sign({
      username: Auth.users[username].displayName,
      issuer: process.env.ISSUER,
      signature: bcrypt.hashSync(process.env.SIGNATURE,8)
    }, Auth.secret,{
       expiresIn: 5*60
    })
    res.redirect(307,redirect_uri+"/"+token)
  }
})

module.exports=router
