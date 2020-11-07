var express = require('express');
var controller = require('../Controller/landingPage')

var router = express.Router();

router.get('/landingPage', controller.landingPage);

module.exports = router;