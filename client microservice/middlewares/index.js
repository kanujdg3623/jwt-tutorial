const jwt = require('jsonwebtoken')
const url = require('url')
const bcrypt = require('bcrypt')

class AuthMiddleware {
  /**
   Checks if user authenticated
  1. jwt fetched from cookie header
  2. jwt library verifies token with secret key
  3. on expiry, invalid user or signature, redirects to auth /login endpoint
    along with client id and redirect uri(/callback)
  **/
  static isAuthenticated(req,res,next){
    let token = req.cookies["jwt"]||""
    jwt.verify(token, process.env.SECRET,(err,user)=>{
      if( !err &&
          user.issuer==process.env.ISSUER &&
          bcrypt.compareSync(process.env.SIGNATURE,user.signature)
      ){
          next(user)
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
}

module.exports = AuthMiddleware
