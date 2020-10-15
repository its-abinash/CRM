var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

exports.edit = async function(req, res) {
    try {
        console.log(`body : ${JSON.stringify(req.body)}`)
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var remfreq = req.body.remfreq;
        var fields = [];
        var data = [];
        if(name !== "") {
            fields.push("name");
            data.push(name);
        }
        if(phone !== "") {
            fields.push("phone");
            data.push(phone);
        }
        if(remfreq !== "") {
            fields.push("remfreq");
            data.push(remfreq);
        }
        console.log(`fields: ${fields}, data: ${data}`)
        var jobDone = await db.update(3, "email", email, fields, data);
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