const jwt = require('jsonwebtoken')
const url = require('url')
const bcrypt = require('bcrypt')

class AuthMiddleware {
  static isAuthenticated(req,res,next){
    let token = req.cookies["jwt"]||""
    jwt.verify(token, process.env.SECRET,(err,decoded)=>{
      if(!err && AuthMiddleware.validateUser(decoded)){
          next(decoded)
      }
      else {
        res.redirect(url.format({
          pathname:process.env.AUTHAPP+"/login",
          query:{
            client_id:process.env.CLIENT_ID,
            redirect_uri:process.env.CLIENTAPP+"/callback"
          }
        }))
      }
    })
  }
  static validateUser(user){
    if(user.issuer!=process.env.ISSUER || !bcrypt.compareSync(process.env.SIGNATURE,user.signature))
      return false
    return true
  }
}

module.exports = AuthMiddleware
