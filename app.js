const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
var logger = require("./Backend/Logger/log");
var { CORE } = require("./Configs/constants.config");
const requestTracer = require('cls-rtracer')
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded(CORE.URL_ENCODED_BODY));
app.use(cors());
app.use(express.static(__dirname + CORE.STATIC_VIEW_PATH));
app.set(CORE.VIEW_ENGINE_ID, CORE.VIEW_ENGINE_NAME);
app.set(CORE.VIEWS_ID, CORE.VIEWS_NAME);
app.use(session(CORE.SESSION_PARAMETERS));
app.use(requestTracer.expressMiddleware())

var UIController = require("./Backend/Controller/coreServices");
var authAPIs = require("./Backend/Api/auth")
var coreServicesAPIs = require("./Backend/Api/coreServices")
var userServicesAPIs = require("./Backend/Api/userServices")

/**
 * @description APIs to be used are listed here
 */
app.use(
  "/",
  authAPIs,
  coreServicesAPIs,
  userServicesAPIs
);

app.get("/", UIController.landingPage);

app.listen(CORE.PORT, () => {
  logger.info(`app is running at http://localhost:${CORE.PORT}}`);
});
