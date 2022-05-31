const express = require('express');
const ForumThreadRouter = express.Router();

const ForumThreadService = require('./ForumThreadService');
const ForumMessageService = require('../forumMessage/ForumMessageService');

const auth = require('../../utils/auth');

// create forumThread
ForumThreadRouter.post('/', auth.isAuthenticated, (req, res, next) => {
  ForumThreadService.createForumThread(req.body, req.user.userID, (msg, thread, code) => {
    if (thread) {
      res.status(code).json(thread);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get all forumThreads or by userID
ForumThreadRouter.get('/', (req, res, next) => {
  const { ownerID } = req.query;
  if (ownerID) {
    ForumThreadService.getForumThreadsByUserId(ownerID, (msg, threads, code) => {
      if (threads) {
        res.status(code).json(threads);
      } else {
        res.status(code).json({
          Error: msg
        });
      }
    });
  } else {
  ForumThreadService.getForumThreads((msg, threads, code) => {
    if (threads) {
      res.status(code).json(threads);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  })};
});

// get all forumThreads of current user
ForumThreadRouter.get('/myForumThreads', auth.isAuthenticated, (req, res, next) => {
  ForumThreadService.getForumThreadsByUserId(req.user.userID, (msg, threads, code) => {
    if (threads) {
      res.status(code).json(threads);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get forumThread by ID
ForumThreadRouter.get('/:threadID', (req, res, next) => {
  ForumThreadService.getForumThreadById(req.params.threadID, (msg, thread, code) => {
    if (thread) {
      res.status(code).json(thread);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get forumMessages by threadId
ForumThreadRouter.get('/:forumThreadID/forumMessages', (req, res, next) => {
  ForumMessageService.getForumMessagesByForumThreadId(req.params.forumThreadID, (msg, messages, code) => {
    if (messages) {
      res.status(code).json(messages);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// delete forumThread by ID
ForumThreadRouter.delete('/:threadID', auth.isAuthenticated, (req, res, next) => {
  ForumThreadService.deleteForumThreadById(req.params.threadID, req.user.userID, req.user.isAdministrator, (msg, result, code) => {
    if(result) {
      res.status(code).json({
        Success: msg
      });
    } else {
      res.status(code).json({
        Error: msg
      })
    }
  })
});

// update thread by id
ForumThreadRouter.put('/:threadID', auth.isAuthenticated, (req, res, next) => {
  ForumThreadService.updateForumThreadById(req.params.threadID, req.body, req.user.userID, req.user.isAdministrator, (msg, user, code) => {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

module.exports = ForumThreadRouter;