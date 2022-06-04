"use strict"

const express = require("express")
const bodyParser = require("body-parser")
const database = require("./database/db")
const testRoutes = require("./endpoints/test/TestRoutes")
const PublicUserRoutes = require("./endpoints/publicUser/PublicUserRoute")
const UserRoutes = require("./endpoints/user/UserRoute")
const UserService = require("./endpoints/user/UserService")
const AuthenticationRoutes = require("./endpoints/authentication/AuthenticationRoute")
const ForumThreads = require("./endpoints/forumThread/ForumThreadRoute")
const logger = require("./config/winston")

const app = express()
app.use(bodyParser.json())


/* Adding the Routes */

app.use("/", testRoutes)
app.use("/publicUsers", PublicUserRoutes)
app.use("/users", UserRoutes)
app.use("/authenticate", AuthenticationRoutes)
app.use("/forumThreads", ForumThreads)
/**
 * app.use(anyfunction) 
 *  app.use expects a function that takes request, response and next (req, res, next) and executes it. 
 * Das wird aber NUR ausgeführt, wenn die controller actions davor ein next haben!!
 * next() geht zur nächsten function und kehrt letztlich wieder zum next() zurück (falls es mitten in der function ist)
 *  und führt dann die function zuende aus
 */
database.initDB(function (err, db) {
  if (db) {
    console.log("Succesfully connected to Database.")
  }
  else {
    console.log("Connection to Database failed")
  }
});

/* Looking for an Administrator */

(async function mustHaveAdmin() {
  try {
    const user = await UserService.findAdmin({});
    if (user == null) {
      UserService.makeAdmin();
      console.log("Sucess.....Please change the default-password!")
    }
  } catch (err) {
    console.error(err);
  }
})();


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
  console.log(`Web2-Project listening at http://localhost:${port}`)
})
