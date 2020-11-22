var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var { DATABASE, STATUSCODE } = require("../../Configs/constants.config");

/**
 * @httpMethod POST
 * @function insert
 * @async
 * @description Inserts user data
 * @param {Object} req
 * @param {Object} res
 */
exports.insert = async function (req, res) {
  try {
    logger.info("POST /insert begins");
    logger.info(`POST /insert body ===> ${JSON.stringify(req.body)}`);
    var data = [
      req.body.name,
      req.body.email,
      req.body.phone,
      req.body.gst,
      req.body.remfreq,
    ];
    logger.info(`data to be inserted ===> ${data}`);
    logger.info("Execution of 'insert' method begins");
    var jobDone = await db.insert(DATABASE.CUSTOMER, data);
    logger.info("Execution of 'insert' method ends");
    if (jobDone) {
      logger.info(
        "User data insertion successful, so redirecting back to dashboard"
      );
      res.status(STATUSCODE.SUCCESS).send({ reason: "success" });
    } else {
      logger.error(
        "User data insertion failed, so redirecting back to dashboard"
      );
      res.status(STATUSCODE.BAD_REQUEST).send({ reason: "failure" });
    }
  } catch (ex) {
    logger.exceptions(`POST /insert Captured Error ===> ${ex}`);
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({ reason: "exception" });
  }
};
