const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
var logger = require("./Backend/Logger/log");
var { CORE } = require("./Configs/constants.config");
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded(CORE.URL_ENCODED_BODY));
app.use(cors());
app.use(express.static(__dirname + CORE.STATIC_VIEW_PATH));
app.set(CORE.VIEW_ENGINE_ID, CORE.VIEW_ENGINE_NAME);
app.set(CORE.VIEWS_ID, CORE.VIEWS_NAME);
app.use(session(CORE.SESSION_PARAMETERS));

var login = require("./Backend/Api/login");
var register = require("./Backend/Api/register");
var controller = require("./Backend/Controller/landingPage");
var edit = require("./Backend/Api/edit");
var add = require("./Backend/Api/insert");
var remove = require("./Backend/Api/delete");
var dashboard = require("./Backend/Api/dashboard");
var email = require("./Backend/Api/email");
var chat = require("./Backend/Api/chat");
var constants = require("./Backend/Api/getConstants");

app.use(
  "/",
  register,
  login,
  edit,
  add,
  remove,
  dashboard,
  email,
  chat,
  constants
);

app.get("/", controller.landingPage);

app.listen(CORE.PORT, () => {
  logger.info(`app is running at http://localhost:${CORE.PORT}}`);
});
