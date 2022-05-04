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

//get one user
router.get('/:userID', function (req, res, next) {
    let userID = req.params.userID
   // res.send(userID)
   userService.findUserBy(userID, function (error, result) {
    if (result) {
        logger.debug("Found user, checking password...")
        res.send(Object.values(result))
    }
    else {
        logger.debug("Session Services: Did not find user for user ID: " + props.userID)
        callback("Did not find user", null);
    }
})
//    res.send("Implementiere mich!")
    //res.json(userID)
})

router.get("/:userID", function (req, res, next) {
    logger.debug("Looking up the user...")
    console.log(`Initiating Token-Generation for User with userID '${req.body.userID}'...`)

    authenticationService.createSessionToken(req.body, function (err, token, user) {
        if (token) {

            res.header("Authorization", "Bearer" + token)
            
            if (user) {
                const { id, userID, userName, ...partialObject } = user
                const subset = { id, userID, userName } /* ich hole mir aus user nur id, userID und Namen!!!!!  *01*  */
                console.log(JSON.stringify(subset))  /* ...dann schreib ich nur diese Userdaten hier in den Body und geb es... */
                res.send(subset) /* ...an die response zurück  */
            }
            else {
                console.log("User is null, even though a token has been created. Error: " + err)
                res.send("Could create token")
            }
        }
        else {
            console.log("Token has not been created, Error: " + err)
            res.send("Could not create token")
        }
    })
})

//create one user
router.post("/signup", function (req, res, next) {
    userService.createUser(function (err, result) {

    })
})

//update one User  (put würde alle parameter updaten. patch nur das, was übergeben wird)
router.patch("/", function (req, res, next) {
    userService.createUser(function (err, result) {

    })
})

//delete one user
router.delete("/:userID", function (req, res, next) {
    userService.createUser(function (err, result) {

    })
})


module.exports = router