var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var logger = require("../Logger/log");
var { STATUSCODE } = require("../../Configs/constants.config");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

/**
 * *NOTE:* Make sure the CONSTANTS are unique
 * E.G: constId = CYPHER
 */
const CONSTANTS = {
  CYPHER: {
    ENCRYPTIONKEY: "#",
    DECRYPTIONKEY: "#",
  },
  ROUTES: {
    REG: "register",
    LOGIN: "login",
    CONTACT: "contact",
    EDIT: "edit",
    ADD: "insert",
    DELETE: "delete",
    EMAIL: "email",
    CHAT: "chat",
    DASHBOARD: "dashboard/getCustomer",
  },
};

/**
 * @httpMethod GET
 * @description getAllConstants will return all CONSTANTS to the client
 * @param {*} req
 * @param {*} res
 */
exports.getAllConstants = function (req, res) {
  logger.info("GET /constants begins");
  try {
    logger.info(`Data sent : ${JSON.stringify(CONSTANTS)}`);
    res.status(STATUSCODE.SUCCESS).send({
      reason: "success",
      values: CONSTANTS,
    });
  } catch (ex) {
    logger.error(`Tracked error in GET /constants ${JSON.stringify(ex)}`);
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .send({ reason: "exception", values: [] });
  }
};

/**
 * @httpMethod GET
 * @description getSpecificFromConstants will return a field of specific CONSTANT from CONSTANTS to the client
 * @param {*} req
 * @param {*} res
 */
exports.getSpecificFromConstants = function (req, res) {
  logger.info(`GET /constants/:constId/:fieldId begins`);
  try {
    var constantId = req.params.constId.toString().toUpperCase();
    var fieldId = req.params.fieldId.toString().toUpperCase();
    logger.info(`CONST_ID : ${constantId} and FIELD_ID : ${fieldId}`);
    if (CONSTANTS.hasOwnProperty(constantId)) {
      if (CONSTANTS[constantId].hasOwnProperty(fieldId)) {
        logger.info(
          `Data sent : ${JSON.stringify(CONSTANTS[constantId][fieldId])}`
        );
        res.status(STATUSCODE.SUCCESS).send({
          reason: "success",
          values: CONSTANTS[constantId][fieldId],
        });
      } else {
        // If fieldId not found then throwing keyError
        throw "fieldId_Not_Found";
      }
    } else {
      // If not present then throwing keyError
      throw "constId_Not_Found";
    }
  } catch (ex) {
    logger.error(
      `Tracked error in GET /constants/:constId/:fieldId ${JSON.stringify(ex)}`
    );
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .send({ reason: "exception", values: [] });
  }
};

/**
 * @httpMethod GET
 * @description getConstant will return the specific CONSTANT to the client
 * @param {*} req
 * @param {*} res
 */
exports.getConstant = function (req, res) {
  logger.info("GET /constants/:constId begins");
  try {
    var constantId = req.params.constId.toString().toUpperCase();
    logger.info(`CONST_ID : ${constantId}`);
    if (CONSTANTS.hasOwnProperty(constantId)) {
      logger.info(`Data sent : ${JSON.stringify(CONSTANTS[constantId])}`);
      res.status(STATUSCODE.SUCCESS).send({
        reason: "success",
        values: CONSTANTS[constantId],
      });
    } else {
      // If not present then throwing keyError
      throw "constId_Not_Found";
    }
  } catch (ex) {
    logger.error(
      `Tracked error in GET /constants/:constId ${JSON.stringify(ex)}`
    );
    res
      .status(STATUSCODE.INTERNAL_SERVER_ERROR)
      .send({ reason: "exception", values: [] });
  }
};
