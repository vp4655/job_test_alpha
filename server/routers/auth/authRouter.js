'use strict';

var express = require('express');
var router = express.Router();
var login = require('./../../controllers/authentication/loginController');

router.post('/login', login.signin);

router.post('/register', login.signup);

router.get('/logout', login.signout);

module.exports = router;