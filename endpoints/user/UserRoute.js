"use strict"

const express = require("express")
const router = express.Router()
const logger = require("../../config/winston")
const UserService = require("./UserService")
const { isAuth, isAdmin } = require("../authentication/AuthenticationService")

/* create one user */
router.post("/", isAuth, isAdmin, (req, res, next) => {
  logger.debug(`Processing UserData... for User with userID '${req.body.userID}'...`)
  UserService.createUser(req.body).then((message) => {
    console.log(`User ${req.body.userID} sucessfully created`)
    res.status(message[2]).send(`User ${req.body.userID} sucessfully created \r\r with Json-Body: \r ` + message[1])
  }).catch((err) => {
    res.status(err[2]).send(err[0])
  })
});


/* get all users */
router.get("/", isAuth, isAdmin, (req, res, next) => {
  UserService.getUsers(function (err, user) {
    if (user) {
      res.send(Object.values(user)).status(999)
    }
    else {
      res.send("There were issues").status(500)
    }
  })
});

/* get one user */
router.get('/:userID', isAuth, isAdmin, (req, res, next) => {
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
});


/* update user */
router.put('/:userID', isAuth, isAdmin, (req, res, next) => {
  UserService.updateUserById(req.params.userID, req.body, 
    function (msg, user) {
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(500).json({
        Error: msg
      });
    }
  });
});

/* delete user by ID */
router.delete('/:userID', isAuth, isAdmin, (req, res, next) => {
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
router.delete('/', isAuth, isAdmin, (req, res, next) => {
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
router.post('/:userID/:isAdmin', isAuth, isAdmin, (req, res, next) => {
  UserService.changeAdministratorStatus(req.params.userID, req.params.isAdmin, function (msg, user, code) {
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