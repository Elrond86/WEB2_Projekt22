const express = require('express');
const AuthRouter = express.Router();

const AuthService = require('./AuthentificationService');

AuthRouter.get('/', (req, res, next) => {
  AuthService.createSessionToken(req.headers.authorization, (msg, token, user, code) => {
    if (token) {
      res.setHeader('Authorization', 'Bearer ' + token);
      if (user) {
        res.status(code).json({
          Success: msg
        });
      } else {
        res.status(code).json({
          Error: msg
        });
      }
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

module.exports = AuthRouter;