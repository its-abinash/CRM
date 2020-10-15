var express = require('express');
var controller = require('../Controller/loginController')

var router = express.Router();

router.get('/login', controller.getLoginPage)

router.post('/login', controller.login);

module.exports = router;