var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

exports.insert = async function(req, res) {
    try {
        console.log(`body : ${JSON.stringify(req.body)}`)
        var data = [req.body.name, req.body.email, req.body.phone, req.body.gst, req.body.remfreq]
        var jobDone = await db.insert(3, data);
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