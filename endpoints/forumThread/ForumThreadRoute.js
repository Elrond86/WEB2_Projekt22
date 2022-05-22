const express = require('express')
const router = express.Router()

const ForumThreadService = require('./ForumThreadService');

/* create one Thread */
router.post("/",
  function (req, res, next) {
    state = `Creating new Thread... `
    logger.debug(state)
    console.log(state)
    ForumThreadService.createForumThread(req.body).then((message) => {
      res.send("Thread sucessfully created")
    }).catch((err) => {
      res.send(err)
    })
  })

  
  module.exports = router