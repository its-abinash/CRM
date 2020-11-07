var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')
var logger = require('../Logger/log')
router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

exports.delete = async function(req, res) {
    try {
        logger.info("POST /delete begins")
        logger.info(`POST /delete body ===> ${JSON.stringify(req.body)}`)
        var email = req.body.email;
        logger.info("Execution of \'remove\' method begins")
        var jobDone = await db.remove(3, "email", email);
        logger.info("Execution of \'remove\' method ends")
        if(jobDone) {
            logger.info("User removal successful, so redirecting back to dashboard")
            req.session.msg = "success"
            res.redirect('/dashboard')
        }else {
            logger.error("User removal failed, so redirecting back to dashboard")
            req.session.msg = "failure"
            res.redirect('/dashboard')
        }
    } catch (ex) {
        logger.error(`POST /delete Captured Error ===> ${ex}`)
        req.session.msg = "exception"
        res.redirect('/dashboard')
    }
}