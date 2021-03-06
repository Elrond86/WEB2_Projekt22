"use strict"

const express = require("express")
const router = express.Router()
const logger = require("../../config/winston")
const FMService = require("./ForumMessageService")
const { isAuth, isAdmin } = require("../authentication/AuthenticationService")


/* create ForumMessage */
router.post("/", isAuth, async (req, res, next) => {
  logger.debug(`Creating new ForumMessage... `)
  
  try {
    const ForumMessage = await FMService.createFM(req)
    res.status(201).json(ForumMessage)
  } catch (err) {
    err.message = "ForumID existiert nicht!"
    res.status(500).json(err.message)
  }
})

/* Auflisten aller Forumnachrichten für Forum über Suchparameter */
router.get("/", async (req, res, next) => {
  logger.debug(`Getting all Messages of this ForumThread...`)
  try{
    const messages = await FMService.getForumThreads(req.query.forumThreadID)
    res.status(200).json(messages)
  } catch (err) {
    res.status(500).json(err.message)
  }
})

 
// get forumMessage by ID
router.get('/:forumMessageID', (req, res, next) => {
  FMService.getForumMessageById(req.params.forumMessageID, (msg, message, code) => {
    if (message) {
      res.status(code).json(message);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});


/* Auflisten aller Forumnachrichten für Forum über nachgelagerte Suche */
//router.get(["/", "/:forumThreadID", ""])



module.exports = router