const session = require("express-session");
const { processPayload, validatePayload, format } = require("./main_utils");
const {
  buildErrorReasons,
  buildResponse,
  getEndMessage,
} = require("./response_utils");
const { emailPayloadSchema } = require("./schema");
const httpStatus = require("http-status");
const emailServiceDao = require("./emailServiceDao");
const { ResponseIds, CYPHER } = require("../../Configs/constants.config");
const mailer = require("nodemailer");
var AES = require("crypto-js/aes"); // Advanced Encryption Standard
const CryptoJs = require("crypto-js");
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
 */
module.exports.processAndSendEmail = async function (req) {
  var payload = await processPayload(req.body);
  payload[FROM] = req.session.user;
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
    var reasons = await buildErrorReasons(errorList);
    var response = await buildResponse(
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
    payload[SUBJECT] = AES.decrypt(
      payload.subject,
      CYPHER.DECRYPTION_KEY
    ).toString(CryptoJs.enc.Utf8);
    payload[TEXT] = AES.decrypt(payload.text, CYPHER.DECRYPTION_KEY).toString(
      CryptoJs.enc.Utf8
    );
    var mailOptions = payload;
    try {
      await transporter.sendMail(mailOptions);
      logger.info("Successfully sent email");
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_013, [payload.to]),
        httpStatus.OK,
        "RI_013"
      );
      logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
      return [httpStatus.OK, response];
    } catch (emailException) {
      logger.error(`Error: ${emailException}`);
      var response = await buildResponse(
        null,
        format(ResponseIds.RI_014, [payload.to]),
        httpStatus.BAD_REQUEST,
        "RI_014"
      );
      return [httpStatus.BAD_REQUEST, response];
    }
  }
};
