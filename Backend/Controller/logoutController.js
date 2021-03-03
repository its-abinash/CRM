var logger = require("../Logger/log");
var session = require("express-session");

/**
 * @httpMethod GET
 * @function logout
 * @async
 * @description logging out the user
 * @param {Object} req
 * @param {Object} res
 */
module.exports.logout = async function (req, res) {
  logger.info("GET /logout begins");
  logger.info(`Closing session for userId: ${req.session.user}`)
  await req.session.destroy();
  res.redirect("/login");
};
