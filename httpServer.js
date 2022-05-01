const express = require("express")
const bodyParser = require("body-parser")
const database = require("./database/db")

const testRoutes = require("./endpoints/test/TestRoutes")
const userRoutes = require("./endpoints/user/UserRoute")
const authenticationRoutes = require("./endpoints/authentication/AuthenticationRoute")

const app = express()
app.use(bodyParser.json())

/* Adding the Routes */

app.use("/", testRoutes)  //an welcher Stelle wollen wirs reinhängen
app.use("/user", userRoutes)
app.use("/authenticate", authenticationRoutes)

database.initDB(function (err, db) {
  if (db) {
    console.log("Succesfully connected to Database.")
  }
  else {
    console.log("Connection to Database failed")
  }
})

/* Error Handler */
app.use(function(req, res, next) {
  res.status(404).send("Sorry can't find this url.")
})

app.use(function(req, res, next) {
  res.status(500).send("Something broke.")
})

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
