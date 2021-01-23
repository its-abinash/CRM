var httpStatus = require("http-status");
var logger = require("../Logger/log");
var main_utils = require("./main_utils");
var jp = require("jsonpath");

var getRandomId = function () {
  return (
    Math.random().toString(36).substring(2, 5) +
    Math.random().toString(36).substring(2, 5)
  );
};

exports.buildResponse = async function (
  data = null,
  reason = null,
  statusCode = httpStatus.BAD_REQUEST,
  responseId = null
) {
  logger.info("In buildResponse");
  var values = [];
  if (data instanceof Array) {
    values = data;
  } else if (data instanceof Object) {
    values.push(data);
  } else {
    values = data || [];
  }
  // Check if values is still array
  if (!(values instanceof Array)) {
    values = [values];
  }

  var reasons = [reason] || ["error"];
  var message = httpStatus[`${statusCode}_MESSAGE`];
  var status = httpStatus[`${statusCode}_NAME`];
  var responseLength = values.length;

  var id =
    responseId || getRandomId() + "-" + getRandomId() + "-" + getRandomId();
  var response = {
    responseId: id,
    status: status,
    statusCode: statusCode,
    responseMessage: message,
    values: values,
    totalCount: responseLength,
    reasons: reasons,
  };
  return response;
};

exports.buildErrorReasons = async function (result) {
  logger.info("In buildErrorReasons")
  var propertiesExpr = "$..property";
  var errorTypeExpr = "$..name";
  var messageExpr = "$..message";
  logger.info(`result = ${JSON.stringify(result)}`)
  var properties = jp.query(result, propertiesExpr);
  var errorTypes = jp.query(result, errorTypeExpr);
  var messages = jp.query(result, messageExpr);
  logger.info(`properties = ${JSON.stringify(properties)}`)
  var reasons = [];
  for (var i = 0; i < properties.length; i++) {
    var fieldName = properties[i].slice(properties[i].indexOf(".") + 1);
    var errorMsg = "";
    if (errorTypes[i] === "type") {
      errorMsg = messages[i];
    } else {
      errorMsg = `Invalid value passed to '${fieldName}' field`;
    }
    reasons.push({
      field: fieldName,
      error: errorMsg,
    });
  }
  return reasons;
};

exports.getEndMessage = function (message, apiType, apiName) {
  var memoryUsed = main_utils.getMemoryUsage();
  message = main_utils.format(message, [apiType, apiName, memoryUsed]);
  return message;
};
