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
    console.log(`In POST/edit ::: edit.js->edit`)
    try {
        console.log(`body : ${JSON.stringify(req.body)}`)
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var rem_freq = req.body.remfreq;
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
        if(rem_freq !== "") {
            fields.push("remfreq");
            data.push(rem_freq);
        }
        console.log(`fields: ${fields}, data: ${data}`)
        var jobDone = await db.update(3, "email", email, fields, data);
        if(jobDone) {
            res.status(200).send({"reason" : "success"})
        }else {
            res.status(400).send({"reason" : "success"})
        }
    } catch (ex) {
        console.log(ex)
        res.status(500).send({"reason" : "success"})
    }
}