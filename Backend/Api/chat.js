var express = require('express')
var controller = require('../Controller/chat')

var router = express.Router()

router.post('/chat', controller.chat)

module.exports = router;