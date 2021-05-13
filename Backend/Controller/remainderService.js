const coreServiceDao = require("./coreServiceDao");
const { format } = require("./main_utils");
const { buildResponse, getEndMessage } = require("./response_utils");
const { ResponseIds } = require("../../Configs/constants.config");
const httpStatus = require("http-status")
var logger = require("../Logger/log");

const REMINDER_SUBJECT = "Check Latest Business Deals!";
const REMINDER_BODY = `Hello,\n\nA gentle remainder to check our latest business deals.\n
Please let us know about your thoughts.\n\nThanks,\nAbinash Biswal`;

/**
 * @function getCustomerIds
 * @description Fetches the emailId from remainderInfos
 * @param {Array} remainderInfos
 * @returns List of emailIds
 */
function getCustomerIds(remainderInfos) {
  var response = [];
  for (const remainderInfo of remainderInfos) {
    response.push({
      email: remainderInfo.email,
      subject: REMINDER_SUBJECT,
      body: REMINDER_BODY,
    });
  }
  return response;
}

/**
 * @async
 * @function processRemainderData
 * @description Fetch latest remainder
 * @param {Object} req
 */
module.exports.processRemainderData = async function (req) {
  var customerIds = await coreServiceDao.getCustomerForRemainderFromDB();
  var remInfo = getCustomerIds(customerIds);
  logger.info(`Remainder Info = ${JSON.stringify(remInfo, null, 3)}`);
  // Updating next remainder date of the customers
  await coreServiceDao.updateRemainderDateInDB(customerIds);
  var response = await buildResponse(
    null,
    format(ResponseIds.RI_006, [
      "remainder information",
      JSON.stringify(remInfo),
    ]),
    httpStatus.OK,
    "RI_006"
  );
  logger.info(getEndMessage(req, ResponseIds.RI_005, req.method, req.path));
  return [httpStatus.OK, response];
};
