var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')
var fs = require('fs')
var logger = require('../Logger/log')
var AES = require('crypto-js/aes') // Advanced Encryption Standard
var CryptoJs = require('crypto-js')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

exports.getConversation = async function(req, res) {
    /*
    When fetching Chat Conversations, we have to decrypt the encoded message
    */
    try {
        logger.info("GET /Chat begins")
        var sender = req.session.user
        var receiver = req.params.receiverId
        logger.info(`Sender = \'${sender}\', Receiver = \'${receiver}\'`)
        var chat = await db.fetch(4, 2, sender, receiver)
        logger.info(`GET /Chat Data Fetched ===> ${JSON.stringify(chat)}`)
        /* Fetching previous conversation */
        for(var i = 0; i < chat.length; i++) {
            chat[i].msg = AES.decrypt(chat[i].msg, '#').toString(CryptoJs.enc.Utf8)
            chat[i].timestamp = new Date((chat[i].timestamp).toString()).toLocaleTimeString()
            chat[i]['time_loc'] = chat[i].sender === sender ? 'time-right' : 'time-left';
            chat[i]['color'] = chat[i].sender === sender ? '' : 'darker';
        }
        logger.info("GET /Chat ends")
        res.status(200).send({'reason':'success', 'values':chat})
    } catch (ex) {
        logger.error(`Tracked error in GET /Chat ${JSON.stringify(ex)}`)
        res.status(400).send({'reason':'exception', 'values':[]})
    }
}

var saveConversation = async function(data) {
    logger.info("Execution of \'saveConversation\' method begins")
    return await db.insert(4, data)
}

exports.chat = async function(req, res) {
    /*
    The Chat Conversation is end-end protected with encryption. Hence, the messages will be
    stored in the database are totally encrypted.
    */
    try {
        logger.info('POST /chat begins')
        logger.info(`POST /chat ===> body = ${JSON.stringify(req.body)}`)
        var sender = req.session.user
        var receiver = req.body.email
        var message = req.body.chatmsg

        /* Saving current conversation in db */

        var data = [sender, receiver, message]
        logger.info("Calling \'saveConversation\' method")
        var jobDone = await saveConversation(data);
        logger.info("Execution of \'saveConversation\' method ends")
        if(jobDone === false) {
            logger.error("Failure status from database, so redirecting back to dashboard")
            res.status(400).send({'reason':'failure'})
        }else {
            logger.info("Success status from database, so redirecting back to dashboard")
            res.status(200).send({'reason':'success'})
        }
    } catch(ex) {
        logger.error("Exception status from database, so redirecting back to dashboard")
        res.status(500).send({'reason':'exception'})
    }
}