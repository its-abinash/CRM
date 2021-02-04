var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var {
  DATABASE,
  ResponseIds,
} = require("../../Configs/constants.config");
const { validatePayload, processPayload, format } = require("./main_utils");
const { insertPayloadSchema } = require("./schema");
const {
  buildErrorReasons,
  buildResponse,
  getEndMessage,
} = require("./response_utils");
const httpStatus = require("http-status");

var FAKE_PASSCODE = "fake_code";
var FAKE_PASSWORD = "fake_password";
var DEFAULT_ADMIN = false;

/**
 * @httpMethod POST
 * @function insert
 * @async
 * @description Inserts user data
 * @param {Object} req
 * @param {Object} res
 */
module.exports.insert = async function (req, res) {
  try {
    logger.info("POST /insert begins");
    var payload = await processPayload(req.body);
    payload["phone"] = payload["phone"].toString();
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      insertPayloadSchema
    );
    if (!isValidPayload) {
      logger.info("Invalid Payload");
      var reasons = await buildErrorReasons(errorList);
      var response = await buildResponse(
        null,
        reasons,
        httpStatus.UNPROCESSABLE_ENTITY,
        "RI_004"
      );
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(response);
    } else {
      var date = new Date();
      date.setDate(date.getDate() + parseInt(payload.remfreq));
      var next_remainder = date.toLocaleDateString();
      var data = [
        payload.name,
        payload.email,
        payload.phone,
        payload.gst,
        payload.remfreq,
        next_remainder,
      ];
      logger.info("Inserting data in customer table");
      var jobDone1 = await db.insert(DATABASE.CUSTOMER, data);
      logger.info("Inserting data in credentials table");
      var jobDone2 = await db.insert(DATABASE.CREDENTIALS, [
        payload.email,
        FAKE_PASSWORD,
        FAKE_PASSCODE,
        DEFAULT_ADMIN,
      ]);
      if (jobDone1 && jobDone2) {
        logger.info("Successfully inserted data");
        var response = await buildResponse(
          null,
          format(ResponseIds.RI_011, ["data", payload.email]),
          httpStatus.CREATED,
          "RI_011"
        );
        logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
        res.status(httpStatus.CREATED).send(response);
      } else {
        logger.error("Failed to insert data");
        var response = await buildResponse(
          null,
          format(ResponseIds.RI_012, ["data", payload.email]),
          httpStatus.BAD_REQUEST,
          "RI_012"
        );
        res.status(httpStatus.BAD_REQUEST).send(response);
      }
    }
  } catch (ex) {
    logger.error(`Error in POST /insert: ${ex}`);
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    );
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
