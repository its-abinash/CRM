const { processPayload, validatePayload, format } = require("./main_utils");
const { emailPayloadSchema } = require("./schema");
const httpStatus = require("http-status");
const emailServiceDao = require("./emailServiceDao");
const { ResponseIds, CYPHER } = require("../../Configs/constants.config");
const mailer = require("nodemailer");
const logger = require("../Logger/log");

const SERVICE_NAME = "gmail";
const FROM = "from";
const TO = "to";
const SUBJECT = "subject";
const TEXT = "text";

/**
 * @function processAndSendEmail
 * @async
 * @description Sends email to user
 * @param {Object} req
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndSendEmail = async function (LoggedInUser, AppRes) {
  var payload = AppRes.getRequestBody();
  payload[FROM] = LoggedInUser;
  payload[TO] = payload.email || "";
  delete payload.email;
  payload[SUBJECT] = payload.subject || "";
  payload[TEXT] = payload.body || "";
  delete payload.body;
  var [isValidPayload, errorList] = await validatePayload(
    payload,
    emailPayloadSchema
  );
  if (!isValidPayload) {
    logger.info(`Invalid Payload with errorList = ${errorList}`);
    var reasons = await AppRes.buildErrorReasons(errorList);
    var response = await AppRes.buildResponse(
      null,
      reasons,
      httpStatus.UNPROCESSABLE_ENTITY,
      "RI_004"
    );
    return [httpStatus.UNPROCESSABLE_ENTITY, response];
  } else {
    var transportFields = {
      service: SERVICE_NAME,
      auth: {
        user: payload.from,
        pass: await emailServiceDao.getPassCode(payload.from),
      },
    };
    var transporter = mailer.createTransport(transportFields);
    payload[SUBJECT] = AppRes.decryptKey(payload.subject);
    payload[TEXT] = AppRes.decryptKey(payload.text);
    var mailOptions = payload;

    await transporter.sendMail(mailOptions);
    logger.info("Successfully sent email");
    var response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_013, [payload.to]),
      httpStatus.OK,
      "RI_013"
    );
    return [httpStatus.OK, response];
  }
};
