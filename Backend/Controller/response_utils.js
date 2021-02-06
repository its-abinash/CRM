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

module.exports.buildResponse = async function (
  data = null,
  reason = null,
  statusCode = httpStatus.BAD_REQUEST,
  responseId = null
) {
  var values = [];
  if (Array.isArray(data)) {
    values = data;
  } else if (data instanceof Object) {
    values.push(data);
  } else {
    values = data || [];
  }
  // Check if values is still not an array
  if (!Array.isArray(values)) {
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

/*
  Returning Wrong Response for Wrong payload
  Work on it for different wrong payloads
  Change UTs accordingly
*/
module.exports.buildErrorReasons = async function (result) {
  var errorTypeExpr = "$[*].name";
  var pathExpr = "$[*].path";
  var argsExpr = "$[*].argument";
  var errorTypes = jp.query(result || {}, errorTypeExpr);
  var path = jp.query(result || {}, pathExpr);
  var arguments = jp.query(result || {}, argsExpr);
  var reasons = [];
  var reason = {};
  for (var i = 0; i < errorTypes.length; i++) {
    var fieldName = arguments[i];
    var errorMsg = null;
    if (errorTypes[i] == "required") {
      errorMsg = `Field '${fieldName}' is required`;
      reason = { field: fieldName, error: errorMsg };
    } else if (errorTypes[i] == "additionalProperties") {
      errorMsg = `Additional field '${fieldName}' is not allowed`;
      reason = { field: fieldName, error: errorMsg };
    } else if (errorTypes[i] == "type") {
      // Iterate over the path & arguments fields for saving individual reason
      reason = [];
      for (var field = 0; field < path[i].length; field++) {
        reason.push({
          field: path[i][field],
          error: `Field '${path[i][field]}' is not a type(s) of ${fieldName[field]}`,
        });
      }
    } else if (errorTypes[i] == "pattern") {
      errorMsg = `Value for field '${path[i]}' is invalid`;
      reason = { field: path[i], error: errorMsg };
    } else {
      errorMsg = "";
    }
    Array.isArray(reason) ? reasons.push(...reason) : reasons.push(reason);
  }
  return reasons;
};

module.exports.getEndMessage = function (message, apiType, apiName) {
  var memoryUsed = main_utils.getMemoryUsage();
  message = main_utils.format(message, [apiType, apiName, memoryUsed]);
  return message;
};
