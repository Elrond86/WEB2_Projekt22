const express = require('express')
const database = require('./database/db')

const testRoutes = require('./endpoints/test/TestRoutes')
const userRoutes = require('./endpoints/user/UserRoute')

const app = express()


/* Adding the Routes */

app.use('/', testRoutes);  //an welcher Stelle wollen wirs reinhängen
app.use('/user', userRoutes);

database.initDB(function(err,db){
    
  if(db){
    console.log("Succesfully connected to Database.")
  }
  else{
    console.log("Connection to Database failed")
  }
})

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
