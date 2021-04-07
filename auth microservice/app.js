require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')

const app = express()
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/login",authRoutes)

app.listen(5000,()=>{
  console.log("listening to authentication")
})
