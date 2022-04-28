var express = require('express');
var router = express.Router();

var authenticationService = require('./AuthenticationService')

router.post('/login', function(req, res, next){

    console.log('Want to create token')

    authenticationService.createSessionToken(req.body, function(err, token, user){

    })
})

module.exports= router;