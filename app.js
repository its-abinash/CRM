const express = require("express");
var cors = require("cors");
var logger = require("./Api/Logger/log");
var { CORE } = require("./Configs/constants.config");
const requestTracer = require("cls-rtracer");
const { app, server } = require("./Configs/settings");

var authAPIs = require("./Api/Endpoints/auth")
var coreServicesAPIs = require("./Api/Endpoints/coreServices")
var userServicesAPIs = require("./Api/Endpoints/userServices")
var mainUtils = require("./Api/Controller/main_utils")
var initTasks = require("./Api/Controller/initTasks")
var commonMiddleWare = require("./Api/Controller/commonMiddleware")

/**
 * @description Middleware to be used are listed here
 */
app.use(
  "/",
  express.json(),
  express.urlencoded(CORE.URL_ENCODED_BODY),
  cors(),
  requestTracer.expressMiddleware(),
  commonMiddleWare.setHeaderElements, // Allowing Cross Origin Resource Sharing Option in Headers
  mainUtils.requestTime, // requestTimeTracerMiddleware
  authAPIs, // Public APIs 
  commonMiddleWare.PreRequestValidation, // Middleware to validate users for private/internal APIs
  coreServicesAPIs,
  userServicesAPIs
);

server.listen(CORE.PORT, "0.0.0.0", () => {
  logger.info(`app is running at http://localhost:${CORE.PORT}`);
  initTasks.run_init_job();
});
