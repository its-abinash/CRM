var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require('../../Database/databaseOperations')

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

var existingUser = async function(email) {
    var res = await db.isExistingUser("email", email);
    console.log(`res = ${res} and type = ${typeof res}`)
    return res;
}

exports.register = async function(req, res) {
    try {
        console.log(req.body)
        var email = req.body.email
        var username = req.body.username
        var password = req.body.password
        var passcode = req.body.passcode
        var isExisting = await existingUser(email)
        console.log(`IS_EXISTING : ${isExisting}`)
        if(isExisting) {
            res.redirect('/login')
        }else {
            var jobDone = await db.insert(1, [email, password, passcode]);
            console.log("registration Completed")
            if(jobDone) {
                res.redirect('/login');
            }else {
                res.redirect('/login')
            }
        }
    } catch (ex) {
        console.log(ex)
        // swal('Server Unreachable - 500', {
        //     buttons: ["Okay!"],
        // });
        res.redirect('/login')
    }
}