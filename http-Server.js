"use strict"

const express = require("express")
const bodyParser = require("body-parser")
const database = require("./database/db")

const PublicUserRouter = require('./endpoints/publicUser/PublicUserRoute'),
      UserRoutes = require("./endpoints/user/UserRoute"),
      AuthenticationRoutes = require("./endpoints/authentication/AuthenticationRoute"),
      ForumThreads = require("./endpoints/forumThread/ForumThreadRoute")

const logger = require("./config/winston")

const fs = require("fs"),
      https = require("https"),
      path = require("path");

const { findAdmin, makeAdmin } = require("./endpoints/user/UserService")



const app = express()

app.use(bodyParser.json())


/* Adding the Routes */

app.use('/publicUsers', PublicUserRouter)
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
    const user = await findAdmin({});
    if (user == null) {
      makeAdmin();
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

app.use(function (req, res, next) {
  res.status(400).send("Bad request")
})




/* loading server-configs */

const port = 443
const certificate = fs.readFileSync(path.join(__dirname, "certificates", "certificate.pem"), "utf8"),
  privateKey = fs.readFileSync(path.join(__dirname, "certificates", "privatekey.pem"), "utf8");




/* Starting the Server */

app.get("/", function (req, res) {
  logger.debug(`Web2-Project listening at http://localhost:${port}`)
  res.send("`Web2-Express-Server listening at http://localhost:${port}` via HTTPS..");  // wird nur gesendet, wenn http-error nicht gecatcht werden
});

const server = https.createServer({
  cert: certificate,
  key: privateKey
}, app);

server.listen(port);