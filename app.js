const express = require("express");
var cors = require("cors");
var logger = require("./Backend/Logger/log");
var { CORE } = require("./Configs/constants.config");
const requestTracer = require("cls-rtracer");
const { app, server } = require("./Configs/settings");
app.use(express.json());
app.use(express.urlencoded(CORE.URL_ENCODED_BODY));
app.use(cors());
app.use(requestTracer.expressMiddleware());

var authAPIs = require("./Backend/Api/auth");
var coreServicesAPIs = require("./Backend/Api/coreServices");
var userServicesAPIs = require("./Backend/Api/userServices");
var mainUtils = require("./Backend/Controller/main_utils");
var initTasks = require("./Backend/Controller/initTasks");
var commonMiddleWare = require("./Backend/Controller/commonMiddleWare");

/**
 * @description Middleware to be used are listed here
 */
app.use(
  "/",
  commonMiddleWare.setHeaderElements, // Allowing Cross Origin Resource Sharing Option in Headers
  mainUtils.requestTime, // requestTimeTracerMiddleware
  authAPIs,
  coreServicesAPIs,
  userServicesAPIs
);

server.listen(CORE.PORT, "0.0.0.0", () => {
  initTasks.run_init_job();
  logger.info(`app is running at http://localhost:${CORE.PORT}}`);
});
