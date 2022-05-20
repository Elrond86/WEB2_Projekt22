const express = require("express")
const bodyParser = require("body-parser")
const database = require("./database/db")

const testRoutes = require("./endpoints/test/TestRoutes")
const PublicUserRoutes = require("./endpoints/publicUser/PublicUserRoute")
const UserRoutes = require("./endpoints/user/UserRoute")
const AuthenticationRoutes = require("./endpoints/authentication/AuthenticationRoute")

const app = express()
app.use(bodyParser.json())


/* Adding the Routes */

app.use("/", testRoutes)
app.use("/publicUsers", PublicUserRoutes)
app.use("/users", UserRoutes)
app.use("/authenticate", AuthenticationRoutes)

database.initDB(function (err, db) {
  if (db) {
    console.log("Succesfully connected to Database.")
  }
  else {
    console.log("Connection to Database failed")
  }
})


/* Error Handler */

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find this url.")
})

app.use(function (req, res, next) {
  res.status(500).send("Something broke.")
})


/* Starting the Server */

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
