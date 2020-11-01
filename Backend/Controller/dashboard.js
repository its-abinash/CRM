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

exports.getCustomers = async function(req, res) {
    console.log(`GET: dashboard/getCustomer ::: Inside dashboard.getCustomers`)
    try {
        var customers = await getContacts();
        res.status(200).send({'reason':'success', 'values':customers})
    }catch(ex) {
        res.status(400).send({'reason':'Exception', 'values':[]})
    }
}

exports.getDashboardPage = async function(req, res) {
    console.log('### Inside controller->dashboard->getDashboardPage ###')
    var msg = "";
    var chat = "";
    if(req.session.hasOwnProperty('msg')) {
        msg = req.session.msg;
    }
    if(req.session.hasOwnProperty('chats')) {
        chat = req.session.chats;
    }
    req.session.msg = null; // removing session value
    console.log(`msg = ${msg}`)
    console.log(`type = ${typeof chat}, msg = ${JSON.stringify(chat)}`)
    res.render('dashboard', {
        contactEndpoint : ENV.endpoints.server + ENV.routes.contact,
        msg : msg,
        addEndpoint : ENV.endpoints.server + ENV.routes.add,
        editEndpoint : ENV.endpoints.server + ENV.routes.edit,
        emailEndpoint : ENV.endpoints.server + ENV.routes.email,
        deleteEndpoint : ENV.endpoints.server + ENV.routes.delete,
        chatEndpoint : ENV.endpoints.server + ENV.routes.chat,
        dashboardEndpoint: ENV.endpoints.server + ENV.routes.dashboard,
        customerData : await getContacts(),
        chat : chat
    })
}