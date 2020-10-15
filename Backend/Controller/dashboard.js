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

var getContacts = async function() {
    var contacts = await db.fetch(3, 1);
    return contacts;
}

exports.getDashboardPage = async function(req, res) {
    console.log('### Inside controller->dashboard->getDashboardPage ###')
    var msg = "";
    if(req.session.hasOwnProperty('msg')) {
        msg = req.session.msg;
    }
    req.session.msg = null; // removing session value
    console.log(`msg = ${msg}`)
    res.render('dashboard', {
        contactEndpoint : ENV.endpoints.server + ENV.routes.contact,
        msg : msg,
        addEndpoint : ENV.endpoints.server + ENV.routes.add,
        editEndpoint : ENV.endpoints.server + ENV.routes.edit,
        emailEndpoint : ENV.endpoints.server + ENV.routes.email,
        deleteEndpoint : ENV.endpoints.server + ENV.routes.delete,
        chatEndpoint : ENV.endpoints.server + ENV.routes.chat,
        customerData : await getContacts()
    })
}