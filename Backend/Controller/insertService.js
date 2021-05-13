const { validatePayload, format, processPayload } = require("./main_utils");
const {
  buildErrorReasons,
  buildResponse,
  getEndMessage,
} = require("./response_utils");
const logger = require("../Logger/log");
const {
  ResponseIds,
  DATABASE,
  URL,
} = require("../../Configs/constants.config");
const httpStatus = require("http-status");
const insertServiceDao = require("./insertServiceDao");
const deleteServiceDao = require("./deleteServiceDao");
const { insertPayloadSchema } = require("./schema");
const session = require("express-session");
const axios = require("axios").default;

const FAKE_PASSCODE = "fake_code";
const FAKE_PASSWORD = "Default@123";
const DEFAULT_ADMIN = false;

var getDefaultImgUrl = async function () {
  var img_data = await axios.get(URL.defaultProfilePictureUrl, {
    responseType: "arraybuffer",
  });
  var base64Uri = await Buffer.from(img_data.data, "binary").toString("base64");
  base64Uri = `data:image/png;base64, ${base64Uri}`;
  return base64Uri;
};

/**
 * @function processAndInsertUserData
 * @async
 * @description Inserts user data
 * @param {Object} req
 */
module.exports.processAndInsertUserData = async function (req) {
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
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    return [httpStatus.UNPROCESSABLE_ENTITY, response];
  } else {
    var date = new Date();
    date.setDate(date.getDate() + parseInt(payload.remfreq));
    var next_remainder = date.toLocaleDateString();
    var imgUrl = await getDefaultImgUrl();
    var customerData = [
      payload.name,
      payload.email,
      payload.phone,
      payload.gst,
      payload.remfreq,
      next_remainder,
      imgUrl,
    ];
    var credData = [payload.email, FAKE_PASSWORD, FAKE_PASSCODE, DEFAULT_ADMIN];
    var usermapData = [
      [req.session.user, payload.email],
      [payload.email, req.session.user],
    ];
    var customerCreated = await insertServiceDao.insertUserData(
      DATABASE.CUSTOMER,
      customerData
    );
    var credentialSaved = await insertServiceDao.insertUserData(
      DATABASE.CREDENTIALS,
      credData
    );
    var usermapCreated = await insertServiceDao.insertUserData(
      DATABASE.USERS_MAP,
      usermapData
    );

    if (customerCreated && credentialSaved && usermapCreated) {
      logger.info("Successfully inserted data");
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_011, ["data", payload.email]),
        httpStatus.CREATED,
        "RI_011"
      );
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
      return [httpStatus.CREATED, response];
    } else {
      logger.error("Failed to insert data");
      await deleteServiceDao.removeDataOnFailure(usermapData, payload.email);
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_012, ["data", payload.email]),
        httpStatus.BAD_REQUEST,
        "RI_012"
      );
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
      return [httpStatus.BAD_REQUEST, response];
    }
  }
};

/**
 * @function processAndInsertProfilePicture
 * @async
 * @description Inserts profile picture of user into db
 * @param {Object} req
 */
module.exports.processAndInsertProfilePicture = async function (req) {
  if (req.session && req.session.user && req.file) {
    var base64Uri = req.file.buffer.toString("base64");
    var url = `data:${req.file.mimetype};base64, ${base64Uri}`;
    await insertServiceDao.saveImageIntoDB(req.session, url);
    var response = await buildResponse(
      null,
      format(ResponseIds.RI_011, ["Profile Picture", req.session.user]),
      httpStatus.OK,
      "RI_011"
    );
    logger.info("Profile Picture Successfully Updated");
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    return [httpStatus.OK, response];
  } else {
    var response = await buildResponse(
      null,
      format(ResponseIds.RI_012, ["Profile Picture", req.session.user]),
      httpStatus.BAD_REQUEST,
      "RI_012"
    );
    logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
    return [httpStatus.BAD_REQUEST, response];
  }
};
