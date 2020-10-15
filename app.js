const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(__dirname + '/Frontend'))
app.set('view engine', 'ejs');
app.set('views', './Frontend/')
app.use(session({
    secret: "Shh, its a secret!",
    resave: true,
    saveUninitialized: true
}));

var login = require('./Backend/Api/login')
var register = require('./Backend/Api/register')
var controller = require('./Backend/Controller/landingPage')
var edit = require('./Backend/Api/edit')
var add = require('./Backend/Api/insert')
var remove = require('./Backend/Api/delete')
var dashboard = require('./Backend/Api/dashboard')
var email = require('./Backend/Api/email')
var chat = require('./Backend/Api/chat')

app.use('/', register, login, edit, add, remove, dashboard, email, chat);

app.get('/', controller.landingPage)

app.listen(3000, () => {
    console.log(`app is running at http://localhost:3000}`);
})