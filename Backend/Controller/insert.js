var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
var session = require("express-session");
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());
var { DATABASE, ResponseIds } = require("../../Configs/constants.config");
const { validatePayload, processPayload, format } = require("./main_utils");
const { insertPayloadSchema } = require("./schema");
const {
  buildErrorReasons,
  buildResponse,
  getEndMessage,
} = require("./response_utils");
const httpStatus = require("http-status");

var FAKE_PASSCODE = "fake_code";
var FAKE_PASSWORD = "Default@123";
var DEFAULT_ADMIN = false;

var removeDataOnFailure = async function (
  isCustomerCreated = false,
  isCredentialSaved = false,
  isUserMapCreated = false,
  userMap = [],
  email = null
) {
  try {
    if (isCustomerCreated) {
      await db.remove(DATABASE.CUSTOMER, "email", email);
    }
    if (isCredentialSaved) {
      await db.remove(DATABASE.CREDENTIALS, "email", email);
    }
    if (isUserMapCreated) {
      for (const each_map of userMap) {
        await db.remove(DATABASE.USERS_MAP, null, each_map);
      }
    }
  } catch (ex) {
    logger.error(`Failed to remove user data with err: ${ex}`);
  }
};

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
    payload["email"] = payload["email"].toLowerCase();
    var [isValidPayload, errorList] = await validatePayload(
      payload,
      insertPayloadSchema
    );
    if (!isValidPayload) {
      logger.info(`Invalid Payload with errorList = ${errorList}`);
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
      var customerCreated = await db.insert(DATABASE.CUSTOMER, data);
      logger.info("Inserting data in credentials table");
      var credentialSaved = await db.insert(DATABASE.CREDENTIALS, [
        payload.email,
        FAKE_PASSWORD,
        FAKE_PASSCODE,
        DEFAULT_ADMIN,
      ]);
      var userMap = [
        [req.session.user, payload.email],
        [payload.email, req.session.user],
      ];
      logger.info("Inserting data in users_map table");
      var usermapCreated = await db.insert(DATABASE.USERS_MAP, userMap);
      if (customerCreated && credentialSaved && usermapCreated) {
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
        await removeDataOnFailure(
          customerCreated,
          credentialSaved,
          usermapCreated,
          userMap,
          payload.email
        );
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
    await removeDataOnFailure(
      customerCreated,
      credentialSaved,
      usermapCreated,
      userMap,
      payload.email
    );
    var response = await buildResponse(null, ex, httpStatus.BAD_GATEWAY);
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
