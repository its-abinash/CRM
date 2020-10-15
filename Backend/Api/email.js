var express = require('express');
var controller = require('../Controller/email')

var router = express.Router();

router.post('/email', controller.email);

module.exports = router;