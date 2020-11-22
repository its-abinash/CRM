var fs = require("fs");
var logger = require("../Logger/log");
let ENV = JSON.parse(fs.readFileSync("./Configs/routes.config.json", "utf-8"));

/**
 * @httpMethod GET
 * @function landingPage
 * @async
 * @description Renders the login-registration html file
 * @param {Object} req
 * @param {Object} res
 */
exports.landingPage = async function (req, res) {
  logger.info("GET /landingPage begins");
  res.render("register", {
    regEndpoint: ENV.endpoints.server + ENV.routes.reg,
    loginEndpoint: ENV.endpoints.server + ENV.routes.login,
  });
};
