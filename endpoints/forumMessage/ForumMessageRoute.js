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
    res.status(201).send(ForumMessage)
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router