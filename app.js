const express = require("express");
var cors = require("cors");
var logger = require("./Api/Logger/log");
var { CORE } = require("./Configs/constants.config");
const requestTracer = require('cls-rtracer')
const app = express();
app.use(express.json());
app.use(express.urlencoded(CORE.URL_ENCODED_BODY));
app.use(cors());
app.use(express.static(__dirname + CORE.STATIC_VIEW_PATH));
app.set(CORE.VIEW_ENGINE_ID, CORE.VIEW_ENGINE_NAME);
app.set(CORE.VIEWS_ID, CORE.VIEWS_NAME);
app.use(requestTracer.expressMiddleware())

var authAPIs = require("./Api/Endpoints/auth")
var coreServicesAPIs = require("./Api/Endpoints/coreServices")
var userServicesAPIs = require("./Api/Endpoints/userServices")
var mainUtils = require("./Api/Controller/main_utils")
var initTasks = require("./Api/Controller/initTasks")
var commonMiddleWare = require("./Api/Controller/commonMiddleWare")

/**
 * @description Middlewares to be used are listed here
 */
app.use(
  "/",
  commonMiddleWare.setHeaderElements, // Allowing Cross Origin Resource Sharing Option in Headers
  mainUtils.requestTime, // requestTimeTracerMiddleware
  authAPIs,
  coreServicesAPIs,
  userServicesAPIs
);


app.listen(CORE.PORT, "0.0.0.0", () => {
  initTasks.run_init_job();
  logger.info(`app is running at http://localhost:${CORE.PORT}}`);
});
