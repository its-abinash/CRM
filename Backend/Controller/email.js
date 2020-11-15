var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')
var mailer = require('nodemailer')
var logger = require('../Logger/log')
var CryptoJs = require('crypto-js')
var AES = require('crypto-js/aes') // Advanced Encryption Standard
router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

var getPassCode = async function(email) {
    logger.info(`Calling \'getPassCode\' method for ${email} to get Google app password`)
    var userCred = await db.fetch(1, 2, "email", email);
    logger.info(`Executing \'getPassCode\' method ends`)
    return userCred[0].passcode;
}

exports.email = async function(req, res) {
    try {
        logger.info("POST /email begins")
        logger.info(`POST /email body ===> ${JSON.stringify(req.body)}`)
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: req.session.user,
                pass: await getPassCode(req.session.user)
            }
        });

        var mailOptions = {
            from: req.session.user,
            to: req.body.email,
            subject: AES.decrypt(req.body.subject, '#').toString(CryptoJs.enc.Utf8),
            text: AES.decrypt(req.body.body, '#').toString(CryptoJs.enc.Utf8)
        };
        logger.info("Initiation of sending mail begins")
        await transporter.sendMail(mailOptions);
        logger.info("Success sending mail")
        res.status(200).send({"reason":"success"})
    } catch (ex) {
        logger.error(`POST /email Captured Error ===> ${ex}`)
        res.status(400).send({"reason":"Exception"})
    }
}