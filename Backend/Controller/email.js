var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var session = require('express-session')
var mailer = require('nodemailer')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

var getPassCode = async function(email) {
    var userCred = await db.fetch(1, 2, "email", email);
    return userCred[0].passcode;
}

exports.email = async function(req, res) {
    /*
        -> Save conversation to db
        -> Send Email to Customer

        - todo -

        -> If the Email was not sent for any reason then retry 5 times. In a retry fetch the data from db and send.
        -> If after retries the email was not sent, delete that data from db.
    */
    try {
        console.log(`body : ${JSON.stringify(req.body)}`)
        var data = [req.session.user, req.body.email, req.body.subject, req.body.body]
        var jobDone = await db.insert(4, data);
        if(jobDone) {
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
                subject: req.body.subject,
                text: req.body.body
            };

            await transporter.sendMail(mailOptions);

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