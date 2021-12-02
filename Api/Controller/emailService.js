const { processPayload, validatePayload, format } = require("./main_utils");
const { emailPayloadSchema } = require("./schema");
const httpStatus = require("http-status");
const emailServiceDao = require("./emailServiceDao");
const { ResponseIds, CYPHER } = require("../../Configs/constants.config");
const mailer = require("nodemailer");
const logger = require("../Logger/log");
const publisher = require("../Broker/rmq.producer");
const { AppResponse } = require("../Controller/response_utils")

const SERVICE_NAME = "gmail";
const FROM = "from";
const TO = "to";
const SUBJECT = "subject";
const TEXT = "text";

/**
 * @async
 * @description This method is being called by RMQ consumer to send email and then inform UI via websocket
 * @param {Object} requestPayload 
 * @returns Acknowledgement response of email
 */
module.exports.sendEmailUtil = async function (requestPayload) {
  logger.info("In sendEmailUtil method");
  var AppRes = new AppResponse();
  var response = {};
  try {
    var transportFields = requestPayload.transportFields;
    var payload = requestPayload.payload;
    var transporter = mailer.createTransport(transportFields);
    payload[SUBJECT] = AppRes.decryptKey(payload.subject);
    payload[TEXT] = AppRes.decryptKey(payload.text);
    await transporter.sendMail(payload);
    logger.info("Successfully sent email");
    response = await AppRes.buildResponse(
      null,
      format(ResponseIds.RI_013, [payload.to]),
      httpStatus.OK,
      "RI_013",
      [payload.to]
    );
  } catch (exception) {
    logger.error(`Exception while sending email: ${String(exception)}`)
    response = await AppRes.buildResponse(
      String(exception),
      format(ResponseIds.RI_029, [String(exception)]),
      httpStatus.BAD_REQUEST,
      "RI_029"
    );
  }
  return response;
};

/**
 * @function processAndSendEmail
 * @async
 * @description Sends email to user
 * @param {Object} req
 * @param {String} LoggedInUser
 * @param {Class} AppRes
 */
module.exports.processAndSendEmail = async function (LoggedInUser, AppRes) {
  var RequestPayload = AppRes.getRequestBody();
  var payload = {
    [FROM]: LoggedInUser,
    [TO]: RequestPayload.email,
    [SUBJECT]: RequestPayload.subject,
    [TEXT]: RequestPayload.body,
  };
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
    var payloadToPublish = {
      transportFields: transportFields,
      payload: payload
    }
    // We will not send email here instead, we publish the transportFields to RMQ
    // and the RMQ consumer will call 'sendEmailUtil' method in background and send email.
    // Here we only send acknowledgement response to UI by informing that we have accepted the request
    // and processing in background.
    publisher.publishEmail(payloadToPublish);
    var response = await AppRes.buildResponse(
      null,
      ResponseIds.RI_035,
      httpStatus.ACCEPTED,
      "RI_035"
    );
    return [httpStatus.ACCEPTED, response];
  }
};
