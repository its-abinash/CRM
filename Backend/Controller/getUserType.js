var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var session = require("express-session");
var fs = require("fs");
var logger = require("../Logger/log");
var { DATABASE, STATUSCODE } = require("../../Configs/constants.config");
var jp = require('jsonpath')

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

var getUserTypeFromDB = async function(userId) {
  var userType = await db.fetch(
    DATABASE.CREDENTIALS,
    DATABASE.FETCH_SPECIFIC,
    "email",
    userId || "demo@domain.com"
  );
  var expr = "$..is_admin"
  var result = jp.query(userType, expr)
  return result[0]
}

exports.getUserType = async function (req, res) {
  try {
    logger.info("GET /getUserType begins");
    var isAdmin = await getUserTypeFromDB(req.session.user);
    logger.info(`Response from database = ${JSON.stringify(isAdmin, null, 3)}`);
    res.status(STATUSCODE.SUCCESS).send({
      reason: "success",
      statusCode: STATUSCODE.SUCCESS,
      values: isAdmin,
    });
  } catch (ex) {
    logger.error(
      `Error Captured from GET /getUserType = ${JSON.stringify(ex, null, 3)}`
    );
    res.status(STATUSCODE.INTERNAL_SERVER_ERROR).send({
        reason: "exception",
        statusCode: STATUSCODE.INTERNAL_SERVER_ERROR,
        values: null
    })
  }
};
