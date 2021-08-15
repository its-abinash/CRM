const { ResponseIds } = require("../../Configs/constants.config");
const httpStatus = require("http-status");
var logger = require("../Logger/log");
const { format } = require("./main_utils");

const CONSTANTS = {
  CYPHER: {
    ENCRYPTIONKEY: "#",
    DECRYPTIONKEY: "#",
  },
  ROUTES: {
    HOME: "home",
    LANDINGPAGE: "landingPage",
    LOGOUT: "logout",
    REG: "register",
    LOGIN: "login",
    CONTACT: "contact",
    EDIT: "edit",
    ADD: "insert",
    UPLOAD: "insert/profilePicture",
    DELETE: "deleteUser",
    EMAIL: "email",
    CHAT: "chat",
    DASHBOARD: {
      CUSTOMER: "dashboard/getCustomer",
      ADMIN: "dashboard/getAdmins",
    },
  },
};

const FIELD_EXCEPTION = "Requested field is not found";
const CONSTID_EXCEPTION = "Requested constantId not found";

/**
 * @function processAndGetAllConstants
 * @description Gets all CONSTANTS
 * @async
 * @param {Object} req
 * @param {Class} AppRes
 */
module.exports.processAndGetAllConstants = async function (req, AppRes) {
  logger.info(`All constants are sent`);
  var response = await AppRes.buildResponse(
    CONSTANTS,
    format(ResponseIds.RI_006, ["Constants"]),
    httpStatus.OK,
    "RI_006"
  );
  return [httpStatus.OK, response];
};

/**
 * @function processAndGetSpecificFromConstants
 * @description Gets a field of specific CONSTANT from CONSTANTS
 * @async
 * @param {Object} req
 * @param {Class} AppRes
 */
module.exports.processAndGetSpecificFromConstants = async function (req, AppRes) {
  var constantId = req.params.constId.toString().toUpperCase();
  var fieldId = req.params.fieldId.toString().toUpperCase();
  logger.info(`constantId: ${constantId}, fieldId: ${fieldId}`);
  if (CONSTANTS.hasOwnProperty(constantId)) {
    if (CONSTANTS[constantId].hasOwnProperty(fieldId)) {
      logger.info(`Data sent : ${CONSTANTS[constantId][fieldId]}`);
      var response = await AppRes.buildResponse(
        CONSTANTS[constantId][fieldId],
        format(ResponseIds.RI_006, ["Constant"]),
        httpStatus.OK,
        "RI_006"
      );
      return [httpStatus.OK, response];
    } else {
      // If fieldId not found then throwing keyError
      throw FIELD_EXCEPTION;
    }
  } else {
    // If not present then throwing keyError
    throw CONSTID_EXCEPTION;
  }
};

/**
 * @function processAndGetConstant
 * @description Gets specific CONSTANT
 * @param {Object} req
 * @param {Class} AppRes
 */
module.exports.processAndGetConstant = async function (req, AppRes) {
  var constantId = req.params.constId.toString().toUpperCase();
  logger.info(`constantId = ${constantId}`);
  if (CONSTANTS.hasOwnProperty(constantId)) {
    logger.info(`Data sent : ${JSON.stringify(CONSTANTS[constantId])}`);
    var response = await AppRes.buildResponse(
      CONSTANTS[constantId],
      format(ResponseIds.RI_006, ["Constant"]),
      httpStatus.OK,
      "RI_006"
    );
    return [httpStatus.OK, response];
  } else {
    // If not present then throwing keyError
    throw CONSTID_EXCEPTION;
  }
};
