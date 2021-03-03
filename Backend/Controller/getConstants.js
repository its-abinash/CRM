var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var logger = require("../Logger/log");
var HttpStatus = require("http-status");
var { format } = require("./main_utils");
var { buildResponse, getEndMessage } = require("./response_utils");
const { ResponseIds } = require("../../Configs/constants.config");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

var FIELD_EXCEPTION = "Requested field is not found";
var CONSTID_EXCEPTION = "Requested constantId not found";

/**
 * @constant
 * *NOTE:* Make sure the CONSTANTS are unique
 * E.G: constId = CYPHER and fieldId = ENCRYPTIONKEY
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
    UPLOAD: "insertProfilePicture",
    DELETE: "delete",
    EMAIL: "email",
    CHAT: "chat",
    DASHBOARD: {
      CUSTOMER: "dashboard/getCustomer",
      ADMIN: "dashboard/getAdmins",
    },
  },
};

/**
 * @httpMethod GET
 * @function getAllConstants
 * @description Gets all CONSTANTS
 * @async
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getAllConstants = async function (req, res) {
  logger.info("GET /constants begins");
  try {
    logger.info(`Data sent : ${JSON.stringify(CONSTANTS)}`);
    var response = await buildResponse(
      CONSTANTS,
      format(ResponseIds.RI_006, ["Constants", JSON.stringify(CONSTANTS)]),
      HttpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
    res.status(HttpStatus.OK).send(response);
  } catch (ex) {
    logger.error(`Error in GET /constants ${ex}`);
    var response = await buildResponse(null, ex, HttpStatus.BAD_GATEWAY);
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getSpecificFromConstants
 * @description Gets a field of specific CONSTANT from CONSTANTS
 * @async
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getSpecificFromConstants = async function (req, res) {
  logger.info(`GET /constants/constId/fieldId begins`);
  try {
    var constantId = req.params.constId.toString().toUpperCase();
    var fieldId = req.params.fieldId.toString().toUpperCase();
    if (CONSTANTS.hasOwnProperty(constantId)) {
      if (CONSTANTS[constantId].hasOwnProperty(fieldId)) {
        logger.info(`Data sent : ${CONSTANTS[constantId][fieldId]}`);
        var response = await buildResponse(
          CONSTANTS[constantId][fieldId],
          format(ResponseIds.RI_006, [
            "Constant",
            CONSTANTS[constantId][fieldId],
          ]),
          HttpStatus.OK,
          "RI_006"
        );
        logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
        res.status(HttpStatus.OK).send(response);
      } else {
        // If fieldId not found then throwing keyError
        throw FIELD_EXCEPTION;
      }
    } else {
      // If not present then throwing keyError
      throw CONSTID_EXCEPTION;
    }
  } catch (ex) {
    logger.error(`Error in GET /constants/constId/fieldId ${ex}`);
    var response = await buildResponse(null, ex, HttpStatus.BAD_GATEWAY);
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};

/**
 * @httpMethod GET
 * @function getConstant
 * @description Gets specific CONSTANT
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getConstant = async function (req, res) {
  logger.info("GET /constants/constId begins");
  try {
    var constantId = req.params.constId.toString().toUpperCase();
    logger.info(`constantId = ${constantId}`);
    if (CONSTANTS.hasOwnProperty(constantId)) {
      logger.info(`Data sent : ${JSON.stringify(CONSTANTS[constantId])}`);
      var response = await buildResponse(
        CONSTANTS[constantId],
        format(ResponseIds.RI_006, [
          "Constant",
          JSON.stringify(CONSTANTS[constantId]),
        ]),
        HttpStatus.OK,
        "RI_006"
      );
      logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
      res.status(HttpStatus.OK).send(response);
    } else {
      // If not present then throwing keyError
      throw CONSTID_EXCEPTION;
    }
  } catch (ex) {
    logger.error(`Error in GET /constants/constId ${ex}`);
    var response = await buildResponse(null, ex, HttpStatus.BAD_GATEWAY);
    res.status(HttpStatus.BAD_GATEWAY).send(response);
  }
};
