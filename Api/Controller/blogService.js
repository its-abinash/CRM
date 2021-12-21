const { validatePayload, format, processPayload } = require("./main_utils");
const logger = require("../Logger/log");
const { ResponseIds } = require("../../Configs/constants.config");
const httpStatus = require("http-status");
const insertServiceDao = require("./insertServiceDao");
const { createBlogSchema } = require("./schema");

/* 
{
  "title": "My first blog",
  "descriptionText": "Hello everyone, this is my first blog",
  "descriptionHTML": "<p>Hello everyone, this is my first blog</p>",
  "authorId": "testuser@gmail.com",
  "authorName": "Test User",
  "createdAt": "1638648457298",
  "lastUpdatedAt": "1638648457298"
}
*/

module.exports.createBlogUtil = async function (loggedInUser, AppRes) {
  var requestPayload = AppRes.getRequestBody();
  var [isValidPayload, errorList] = await validatePayload(
    requestPayload,
    createBlogSchema
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
    var blogId = AppRes.getRandomId();
    requestPayload["blogId"] = blogId;

    var reasons = [format(ResponseIds.RI_012, ["BlogDetails", loggedInUser])];
    var statusCode = httpStatus.BAD_REQUEST;
    var translateCodes = ["BlogDetails", loggedInUser];
    var respCode = "RI_012";

    var blogDetailsSaved = insertServiceDao.createBlogDetails(requestPayload);
    if (blogDetailsSaved) {
      reasons = [format(ResponseIds.RI_011, ["BlogDetails", loggedInUser])];
      statusCode = httpStatus.CREATED;
      translateCodes = ["BlogDetails", loggedInUser];
      respCode = "RI_011";
    }

    var response = await AppRes.buildResponse(
      null,
      reasons,
      statusCode,
      respCode,
      translateCodes
    );
    return [statusCode, response]
  }
};
