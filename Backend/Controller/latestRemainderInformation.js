var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var cors = require("cors");
var db = require("../../Database/databaseOperations");
var logger = require("../Logger/log");
var {
  DATABASE,
  ResponseIds,
} = require("../../Configs/constants.config");
const { buildResponse, getEndMessage } = require("./response_utils");
const { format } = require("./main_utils");
const httpStatus = require("http-status");

router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cors());

var REMINDER_SUBJECT = "Check Latest Business Deals!";
var REMINDER_BODY = `Hello,\n\nA gentle remainder to check our latest business deals.\n
Please let us know about your thoughts.\n\nThanks,\nAbinash Biswal`;

/**
 * @function getCustomerForRemainderFromDB
 * @description gets the latest remainder information from database
 * @returns List of emailIds
 */
async function getCustomerForRemainderFromDB() {
  var remInfo = await db.fetchLatestRemainder();
  return remInfo;
}

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
 * @function updateRemainderDateInDB
 * @description Updates the next_remainder for the customers in DB
 * @param {Array} customers
 */
async function updateRemainderDateInDB(customers) {
  logger.info("In updateRemainderDateInDB");
  for (const customer of customers) {
    var date = new Date();
    date.setDate(date.getDate() + parseInt(customer.remfreq));
    var next_remainder = date.toLocaleDateString();
    await db.update(
      DATABASE.CUSTOMER,
      "email",
      customer.email,
      ["next_remainder"],
      [next_remainder]
    );
  }
}

/**
 * @httpMethod GET
 * @async
 * @function latestRemainderInformation
 * @description Fetch latest remainder
 * @param {Object} req
 * @param {Object} res
 */
exports.latestRemainderInformation = async function (req, res) {
  try {
    logger.info("GET /getLatestRemainderInformation begins");
    var customerIds = await getCustomerForRemainderFromDB();
    var remInfo = getCustomerIds(customerIds);
    logger.info(`Remainder Info = ${JSON.stringify(remInfo, null, 3)}`);
    // Updating next remainder date of the customers
    await updateRemainderDateInDB(customerIds);
    var response = await buildResponse(
      null,
      format(ResponseIds.RI_006, [
        "remainder information",
        JSON.stringify(remInfo),
      ]),
      httpStatus.OK,
      "RI_006"
    );
    logger.info(getEndMessage(ResponseIds.RI_005, req.method, req.path));
    res.status(httpStatus.OK).send(response);
  } catch (ex) {
    logger.error(
      `Error in GET /getLatestRemainderInformation: ${JSON.stringify(
        ex,
        null,
        3
      )}`
    );
    var response = await buildResponse(
      null,
      "exception",
      httpStatus.BAD_GATEWAY
    )
    res.status(httpStatus.BAD_GATEWAY).send(response);
  }
};
