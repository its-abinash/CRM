var express = require('express');
var controller = require('../Controller/landingPage')

var router = express.Router();

router.get('/landingPage', controller.landingPage);

// router.post('/postUserData', controller.postUserData)

module.exports = router;