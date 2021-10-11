const httpStatus = require("http-status");
const { ResponseIds } = require("../../Configs/constants.config");
const logger = require("../Logger/log");
const { AppResponse } = require("./response_utils");
const utils = require("./utils");

module.exports.setHeaderElements = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
};

/**
 * @middleware PreRequestValidation
 * @param {Object} req
 * @param {Object} res
 * @param {Callback} next
 * @description This middleware validates JWT token. If the user does not have a valid token, the request will be failed right away.
 */
module.exports.PreRequestValidation = async function (req, res, next) {
  var RequestObj = new AppResponse(req);
  var LoggedInUser = await utils.decodeJwt(RequestObj);
  if (!LoggedInUser) {
    logger.error("User is unauthorized");
    var response = await RequestObj.buildResponse(
      null,
      ResponseIds.RI_015,
      httpStatus.UNAUTHORIZED,
      "RI_015"
    );
    logger.error(`Unauthorized request to ${req.method} ${req.path}`)
    res.status(httpStatus.UNAUTHORIZED).send(response);
  } else {
    req.loggedInUser = LoggedInUser;
    next();
  }
};
