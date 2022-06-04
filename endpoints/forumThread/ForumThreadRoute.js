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

/* find all forumThreads ore all Threads of query-userID */
/** if-scope he no like... hmm */
router.get("/", async (req, res, next) => {
  logger.debug(JSON.stringify(req.query))
  if (req.query.ownerID) {
    logger.debug(`Getting ForumThreads with ownerID: ${req.query.ownerID}...`)
    try {
      const Threads = await ForumThreadService.getForumThreadsByUserID(req.query.ownerID)
      res.status(200).send(Threads)
    } catch (err) {
      res.status(404).send(err)
    }
    return
  }
  logger.debug("Getting all ForumThreads...")
  try {
    const Threads = await ForumThreadService.getForumThreads()
    res.status(200).send(Threads)
  } catch (err) {
    res.status(404).send(err)
  }
})

/* ACHTUNG: Dies Route "../myForumThreads" muss vor allen stehen, die eine ID in der Adresse haben, sonst wird sie nicht gefunden!
/* get one Thread by CURRENT UserID */
router.get("/myForumThreads", isAuth, async (req, res, next) => {
  logger.debug(`Getting ForumThreads with ownerID: ${req.user.userID}...`)
  logger.debug(req.params.forumThreadID)
  try {
    const Threads = await ForumThreadService.getForumThreadsByUserID(req.user.userID)
    res.status(200).send(Threads)
  } catch (err) {
    res.status(404).send(err)
  }
})

/* get one Thread by ThreadID */
router.get("/:forumThreadID", async (req, res, next) => {
  logger.debug("Getting ForumThreads with _id ${forumThreadID}...")
  logger.debug(req.params.forumThreadID)
  try {
    const Threads = await ForumThreadService.getForumThreadByID(req.params.forumThreadID)
    res.status(200).send(Threads)
  } catch (err) {
    res.status(404).send(err)
  }
})

/* update forumThread */
router.put("/:forumThreadID", isAuth, async (req, res, next) => {
  logger.debug(req.params.forumThreadID)
  try {
    const Thread = await ForumThreadService.updateForumThreadByID(req.params.forumThreadID, req.body)

    res.status(200).send(Thread)
  } catch (err) {
    res.status(500).send(err)
  }
})


/* delete Thread by ThreadID */
router.delete('/:forumThreadID', isAuth, async (req, res, next) => {
  logger.debug("starte try-catch...")
  try {
    const deleteQuery = await ForumThreadService.deleteThreadByID(req.params.forumThreadID)
    if (deleteQuery.deletedCount == 0) {
      res.status(404).send("Request was correct, but thread does not exist.")
    }
    res.status(200).send("Thread sucessfully deleted")
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
})


/* delete all ForumThreads */
/* delete all users */
/* router.delete('/', isAuth, isAdmin, async (req, res, next) => {
  try {
    await ForumThreadService.deleteAllThreads.exec()
    res.status(200).json({ Message: `All users succesfully deleted` })
  } catch (err) {
    res.status(500).json({ Error: `Could not delete all users` })
  }
}); */



module.exports = router