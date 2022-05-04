var express = require("express");
var router = express.Router();
var config = require("config")
var logger = require("../../config/winston")

/* get all users */

var userService = require("./UserService")

router.get("/", function (req, res, next) {        // req ist http-Request-object und wird von Express übergeben,res ist http-response object (kommt auch von Express) ,next geht zur nächsten Router in der pipeline
    userService.getUsers(function (err, result) {
        if (result) {
            res.send(Object.values(result))  //wenn result Objekt nicht NULL ist, in ein Array-Objekt überführen  anders gesagt : "result kommt zurück"
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
    let userID = req.params.userID
    // res.send(userID)
    userService.findUserBy(userID, function (error, result) {
        if (result) {
            logger.debug("Found user, checking password...")
            res.send(Object.assign(result))
            //res.send(Object.values(result))
        }
        else {
            logger.debug("Session Services: Did not find user for user ID: " + props.userID)
            callback("Did not find user", null);
        }
    })

})

/* create one user */

router.post("/signup", function (req, res, next) {
    logger.debug("Processing UserData...")
    console.log(`Processing UserData... for User with userID '${req.body.userID}'...`)

    userService.createUser(req.body, function (err, result) {



        if ("admin" == searchUserID) {  //kommt nur, wenn ich mich als "admin" einloggen will und es diesen user nicht gibt.
                console.log("Do not have admin account yet. Creating it with default password...")
                var adminUser = new User()
                adminUser.ID = ""
                adminUser.userID = "admin"
                adminUser.password = "123"
                adminUser.userName = "Default Administrator Account"
                adminUser.isAdministrator = true

                adminUser.save(function (err) {
                    if (err) {
                        logger.debug("Could not create default admin account: " + err)
                        callback("Could not login to admin account", null)
                    }
                    else {
                        callback(null, adminUser)
                    }
                })
            }
        else {
                logger.debug("Could not find user for userID: " + searchUserID)
                callback(null, user)  // das kommt dann zurück und wird da zurckgegeben als function-return: userService.findUserBy(props.userID, function (error, user)
        }
        



        res.send("...")
    })
})

/* update one User */   //(put würde alle parameter updaten. patch nur das, was übergeben wird)

router.patch("/", function (req, res, next) {
    userService.createUser(function (err, result) {

    })
})

/* delete one user */
router.delete("/:userID", function (req, res, next) {
    userService.createUser(function (err, result) {

    })
})


module.exports = router