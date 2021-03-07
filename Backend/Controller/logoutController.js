var logger = require("../Logger/log");
var session = require("express-session");
const { getEndMessage } = require("./response_utils");
const { ResponseIds } = require("../../Configs/constants.config");

/**
 * @httpMethod GET
 * @function logout
 * @async
 * @description logging out the user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = async function (req, res) {
  req._initialTime = Date.now();
  logger.info("GET /logout begins");
  logger.info(`Closing session for userId: ${req.session.user}`);
  await req.session.destroy();
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  res.redirect("/login");
};
