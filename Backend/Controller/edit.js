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
 * @function edit
 * @async
 * @description Update details of user
 * @param {Object} req
 * @param {Object} res
 */
exports.edit = async function (req, res) {
  try {
    logger.info("POST /edit begins");
    logger.info(`POST /edit body ===> ${JSON.stringify(req.body)}`);
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var rem_freq = req.body.remfreq;
    var fields = [];
    var data = [];
    if (name !== "") {
      fields.push("name");
      data.push(name);
    }
    if (phone !== "") {
      fields.push("phone");
      data.push(phone);
    }
    if (rem_freq !== "") {
      fields.push("remfreq");
      data.push(rem_freq);
    }
    logger.info(`fields: ${fields}, data: ${data}`);
    logger.info("Execution of 'update' method begins");
    var jobDone = await db.update(
      DATABASE.CUSTOMER,
      "email",
      email,
      fields,
      data
    );
    logger.info("Execution of 'update' method ends");
    if (jobDone) {
      logger.info("Edit successful, so redirecting back to dashboard");
      res.status(STATUSCODE.SUCCESS).send({ reason: "success" });
    } else {
      logger.error("Edit failed, so redirecting back to dashboard");
      res.status(STATUSCODE.BAD_REQUEST).send({ reason: "failure" });
    }
  } catch (ex) {
    logger.exceptions(`POST /edit Captured Error ===> ${ex}`);
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({ reason: "exception" });
  }
};
