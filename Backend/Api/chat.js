var express = require('express')
var controller = require('../Controller/chat')

var router = express.Router()

router.get('/chat/:receiverId', controller.getConversation)

router.post('/chat', controller.chat)

module.exports = router;