"use strict"

const express = require("express")
const router = express.Router()
const logger = require("../../config/winston")
const ForumMessage = require("./ForumMessageModel")
const FMService = require("./ForumMessageService")

/* create ForumMessage */
router.post("/", async(req,res,next) => {
    logger.debug(`Creating new ForumMessage... `)
    try {
      const ForumMessage = await FMService.createFM(req.body, req.user)
      res.status(201).send(ForumMessage)
    } catch (err) {
      res.status(500).send(err)
    }
  })
 