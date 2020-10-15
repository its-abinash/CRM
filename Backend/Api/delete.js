var express = require('express');
var controller = require('../Controller/delete')

var router = express.Router();

router.post('/delete', controller.delete);

module.exports = router;