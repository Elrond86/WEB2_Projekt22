"use strict"

const express = require('express')
const router = express.Router()
const ForumThreadService = require('./ForumThreadService');
const { isAuth, isAdmin } = require("../authentication/AuthenticationService")
const logger = require("../../config/winston")


/* create one Thread */   //die zwiete middleware nimmt nur req und nichts von der ersten. aber die erste MW kann das req verändern und dann nimmt die zwiete MW das veränderte req
router.post("/", isAuth, async (req, res, next) => {
  logger.debug(`Creating new Thread... `)
  try {
    const Thread = await ForumThreadService.createForumThread(req.body, req.user)
    res.status(201).send(Thread)
  } catch (err) {
    res.status(500).send(err)
  }
})

/* get all threads */
router.get("/", async (req, res, next) => {
  logger.debug("Getting all ForumThreads...")
  try {
    const Threads = await ForumThreadService.getForumThreads()
    res.status(200).send(Threads)
  } catch (err){
    res.status(404).send(err)
  }
})







/* get one user */
router.get('/:userID', isAuth, isAdmin, (req, res, next) => {
  ForumThreadService.findUserBy(req.params.userID,
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
}
);


/* update user */
router.put('/:userID', isAuth, isAdmin, (req, res, next) => {
  ForumThreadService.updateUserById(req.params.userID, req.body, function (msg, user, code) {
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
router.delete('/:userID', isAuth, isAdmin, (req, res, next) => {
  ForumThreadService.deleteUserById(req.params.userID, function (msg, result, code) {
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
  ForumThreadService.deleteAllUsers(function (err, result) {
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

module.exports = router