const express = require("express");
const router = express.Router();
const logger = require("../../config/winston");

const authService = require("../authentificate/AuthService");
const MessageService = require("./MessageService");

// create a new message
router.post("/create", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      const { content, to } = req.body;
      MessageService.createNewMessage(content, to, user, (err, message) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(message);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

// get all messages of the logged in user
router.get("/", (req, res) => {
  try {
    const token = req.get("Authorization");
    authService.checkSessionToken(token, (err, user) => {
      logger.debug(user);
      if (err) return res.status(400).send(err);

      MessageService.getMessagesOfChat(user, (err, message) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(message);
      });
    });
  } catch (error) {
    res.status(500);
  }
});

module.exports = router;
