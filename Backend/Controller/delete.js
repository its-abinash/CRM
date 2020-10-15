var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

exports.delete = async function(req, res) {
    try {
        console.log(`body : ${JSON.stringify(req.body)}`)
        var email = req.body.email;
        var jobDone = await db.remove(3, "email", email);
        if(jobDone) {
            req.session.msg = "success"
            res.redirect('/dashboard')
        }else {
            req.session.msg = "failure"
            res.redirect('/dashboard')
        }
    } catch (ex) {
        console.log(ex)
        req.session.msg = "exception"
        res.redirect('/dashboard')
    }
}