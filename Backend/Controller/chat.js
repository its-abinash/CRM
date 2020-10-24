var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')
var fs = require('fs')
let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", 'utf-8'))

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

var getConversation = async function(sender, receiver) {
    return await db.fetch(4, 2, sender, receiver)
}

var saveConversation = async function(data) {
    return await db.insert(4, data)
}

exports.chat = async function(req, res) {
    console.log('### Inside controller->chat->chat ###')
    console.log(`body = ${JSON.stringify(req.body)}`)
    try {
        var sender = req.session.user
        var receiver = req.body.email
        var message = req.body.chatmsg

        /* Saving current conversation in db */

        var data = [sender, receiver, message]
        var jobDone = await saveConversation(data);
        if(jobDone === false) {
            req.session.msg = "failure"
            res.redirect('/dashboard')
        }

        /* Fetching previous conversation */

        var chat = await getConversation(sender, receiver);
        for(var i = 0; i < chat.length; i++) {
            console.log(new Date((chat[i].timestamp).toString()).toLocaleDateString())
            chat[i].timestamp = new Date((chat[i].timestamp).toString()).toLocaleTimeString()
            chat[i]['time_loc'] = chat[i].sender === sender ? 'time-right' : 'time-left';
            chat[i]['color'] = chat[i].sender === sender ? '' : 'darker';
        }
        console.log(chat)
        req.session.chats = chat
        req.session.msg = "success"
        res.redirect('/dashboard')
    } catch(ex) {
        req.session.msg = "exception"
        res.redirect('/dashboard')
    }
}