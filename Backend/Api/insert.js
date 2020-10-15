var express = require('express');
var controller = require('../Controller/insert')

var router = express.Router();

router.post('/insert', controller.insert);

module.exports = router;