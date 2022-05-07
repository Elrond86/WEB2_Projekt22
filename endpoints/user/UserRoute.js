var express = require("express");
var router = express.Router();
var config = require("config")
var logger = require("../../config/winston")

/* get all users */

var userService = require("./UserService")

router.get("/", function (req, res, next) {        // req ist http-Request-object und wird von Express übergeben,res ist http-response object (kommt auch von Express) ,next geht zur nächsten Router in der pipeline
    userService.getUsers(function (err, user) {
        if (user) {
            res.send(Object.values(user))  //wenn user Objekt nicht NULL ist, in ein Array-Objekt überführen  anders gesagt : "user kommt zurück"
        }
        else {
            res.send("There were issues")  //Wenn Error
        }
    })
    logger.debug("Everything working fine in user route")
}
)

/* get one user */
router.get('/:userID', function (req, res, next) {
    userService.findUserBy(req.params.userID, function (err, user) {
        if (user) {
            //res.send(Object.assign(user))
            logger.debug(user)
            res.json(user)
        }
        else {
            logger.error(err)
            res.send("Did not find any User with this userID" + [])
        }
    })
})

/* create one user */

router.post("/", function (req, res, next) {
    state = `Processing UserData... for User with userID '${req.body.userID}'...`;    logger.debug(state);    console.log(state)

    userService.createUser(req.body, function (err, user) {
        if (user) {
            res.send(`User ${req.body.userID} sucessfully created \r\r with Json-Body: \r ` + user)
            //res.send(user)
            //res.send(null, user)  // das kommt dann zurück und wird da zurückgegeben als function-return: userService.findUserBy(props.userID, function (error, user)
        }
        else {
            logger.debug("Could not create user: " + req.body.userID)
            res.send("Could not create user: " + req.body.userID, null)  // callback übergibt fehlernachricht

        }
    })
})

/* update one User */   //(put würde alle parameter updaten. patch nur das, was übergeben wird)

router.patch("/", function (req, res, next) {
    userService.createUser(function (err, user) {

    })
})

/* delete one user */
router.delete("/:userID", function (req, res, next) {
    userService.createUser(function (err, user) {

    })
})


module.exports = router