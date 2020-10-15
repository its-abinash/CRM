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

exports.chat = async function(req, res) {
    console.log('### Inside controller->chat->chat ###')
    console.log(`body = ${JSON.stringify(req.body)}`)
    res.render('chat')
}