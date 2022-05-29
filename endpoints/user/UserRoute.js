"use strict"

var express = require("express")
var router = express.Router()
var config = require("config")
var logger = require("../../config/winston")
var UserService = require("./UserService")

/* get all users */
router.get("/", function (req, res, next) {
  UserService.getUsers(function (err, user) {
    if (user) {
      res.send(Object.values(user))
    }
    else {
      res.send("There were issues")
    }
  })
  logger.debug("Everything working fine in user route")
}
)

/* get one user */
router.get('/:userID', function (req, res, next) {
  UserService.findUserBy(req.params.userID,
    function (err, user) {
      if (user) {
        res.send(user)
        logger.debug(user)
      }
      else {
        logger.error(err)
        res.send("Did not find any User with this userID" + [])
      }
    })
})

/* create one user */
router.post("/", function (req, res, next) {
    let state = `Processing UserData... for User with userID '${req.body.userID}'...`
    logger.debug(state)
    console.log(state)
    UserService.createUser(req.body).then((message) => {
      console.log(`User ${req.body.userID} sucessfully created`)
      res.status(message[2]).send(`User ${req.body.userID} sucessfully created \r\r with Json-Body: \r ` + message[1])
    }).catch((err) => {
      res.send(err)
    })
  })

/* update user */
router.put('/:userID', function (req, res, next) {
  UserService.updateUserById(req.params.userID, req.body, function (msg, user, code) {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

/* delete user by ID */
router.delete('/:userID', function (req, res, next) {
  UserService.deleteUserById(req.params.userID, function (msg, result, code) {
    if (result) {
      res.send(`User ${req.params.userID} succesfully deleted.`)
    } else {
      res.status(code).json({
        Error: msg
      })
    }
  })
});

/* delete all users */
router.delete('/', function (req, res, next) {
  UserService.deleteAllUsers(function (err, result) {
    if (result) {
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

/* update administrator status */
router.post('/:userID/:isAdministrator', function (req, res, next) {
  UserService.changeAdministratorStatus(req.params.userID, req.params.isAdministrator, function (msg, user, code) {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

module.exports = router