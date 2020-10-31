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

exports.getConversation = async function(req, res) {
    console.log("GET/Chat Request :::: Inside chat->getConversation")
    try {
        var sender = req.session.user
        var receiver = req.params.receiverId
        var chat = await db.fetch(4, 2, sender, receiver)
        /* Fetching previous conversation */
        for(var i = 0; i < chat.length; i++) {
            chat[i].timestamp = new Date((chat[i].timestamp).toString()).toLocaleTimeString()
            chat[i]['time_loc'] = chat[i].sender === sender ? 'time-right' : 'time-left';
            chat[i]['color'] = chat[i].sender === sender ? '' : 'darker';
        }
        res.status(200).send({'reason':'success', 'values':chat})
    } catch (ex) {
        res.status(400).send({'reason':'Exception', 'values':[]})
    }
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
        req.session.msg = "success"
        res.redirect('/dashboard')
    } catch(ex) {
        req.session.msg = "exception"
        res.redirect('/dashboard')
    }
}