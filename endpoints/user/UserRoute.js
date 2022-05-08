var express = require("express")
var router = express.Router()
var config = require("config")
var logger = require("../../config/winston")
var userService = require("./UserService")

/* get all users */
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
    userService.findUserBy(req.params.userID,
        function (err, user) { //UserRoute > router.get('/:userID') callback > userService.findUserBy() callback
            if (user) { res.send(user); logger.debug(user) }
            else { logger.error(err); res.send("Did not find any User with this userID" + []) }
        })
})

/* create one user */
router.post("/",
    function (req, res, next) {
        state = `Processing UserData... for User with userID '${req.body.userID}'...`; logger.debug(state); console.log(state)
        userService.createUser(req.body, function (err, user) {
            if (user) { res.send(`User ${req.body.userID} sucessfully created \r\r with Json-Body: \r ` + user) }
            else { logger.debug("Could not create user: " + req.body.userID); res.send("Could not create user: " + req.body.userID, null) }
        })
    })

/* update one User */   //(put würde alle parameter updaten. patch nur das, was übergeben wird)

// update user
router.put('/:userID', function (req, res, next) {
    userService.updateUserById(req.params.userID, req.body, function (msg, user, code) {
      if (user) {
        res.status(code).json(user)
      } else {
        res.status(code).json({
          Error: msg
        });
      }
    });
  });


  // delete user by ID
router.delete('/:userID', function (req, res, next) {
    userService.deleteUserById(req.params.userID, function (msg, result, code) {
      if(result) {
        res.status(code).json({
          Message: msg
        });
      } else {
        res.status(code).json({
          Error: msg
        })
      }
    })
  });
  
  // FOR DEV ONLY delete all users
 router.delete('/', function (req, res, next) {
    userService.deleteAllUsers( function (err, result) {
      if(result) {
        res.status(200).json({
          Message: `All users succesfully deleted`
        });
      } else {
        res.status(500).json({
          Error: `Could not delete all users`
        })
      }
    })
  });
  
  // update administrator status
  router.post('/:userID/:isAdministrator', function (req, res, next) {
    userService.changeAdministratorStatus(req.params.userID, req.params.isAdministrator, function (msg, user, code) {
      if (user) {
        res.status(code).json(user)
      } else {
        res.status(code).json({
          Error: msg
        });
      }
    });
  });

/* delete one user */
router.delete("/:userID", function (req, res, next) {
    userService.createUser(function (err, user) {

    })
})


module.exports = router