var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var cors = require('cors')
var db = require("../../Database/databaseOperations")
var fs = require('fs')
let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", 'utf-8'))
var session = require('express-session');

router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(cors());

var isValidUser = async function(email, password) {
    var isExistingUser = await db.isExistingUser("email", email);
    if(isExistingUser) {
        return await db.isValidUser("email", email, password);
    }
}

exports.getLoginPage = async function(req, res) {
    console.log('### Inside controller->loginController->getLoginPage ###')
    res.render('register', {
        regEndpoint : ENV.endpoints.server + ENV.routes.reg,
        loginEndpoint : ENV.endpoints.server + ENV.routes.login
    })
}

// exports.getContactPage = async function(req, res) {
//     console.log('### Inside controller->loginController->getContactPage ###')
//     res.render('contact', {
//         contacts : await getContacts()
//     })
// }

exports.login = async function(req, res) {
    try {
        console.log(req.body)
        var email = req.body.email
        var password = req.body.password
        var validUser = await isValidUser(email, password)
        if(validUser) {
            req.session.user = email
            req.session.password = password
            res.redirect("/dashboard")
        }else {
            res.redirect('/login');
        }
    } catch (ex) {
        console.log(ex)
        res.redirect('/login')
    }
}