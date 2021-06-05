var httpStatus = require("http-status");
var logger = require("../Logger/log");
var main_utils = require("./main_utils");
var jp = require("jsonpath");
var { v4: uuid } = require("uuid");
var { ResponseIds } = require("../../Configs/constants.config");
var session = require("express-session");
const { URL, URLSearchParams } = require("url");
const qString = require("querystring");

class AppResponse {
  constructor(request = null) {
    this.request = request || {};
  }

  async destroySession() {
    try {
      await this.request.session.destroy();
      return true;
    } catch (exc) {
      throw exc;
    }
  }

  getQueryParams() {
    const req = this.request;
    const encodedReqUrl = req.originalUrl;
    const encodedParams = encodedReqUrl.slice(encodedReqUrl.indexOf("?") + 1)
    if(encodedParams === "") {
      return {}
    }
    const decodedParams = Buffer.from(encodedParams, "base64");
    const reqUrl = req.protocol + "://" + req.get("host") + "?" + decodedParams;
    const parsedUrl = new URL(reqUrl);
    const searchParamsObject = new URLSearchParams(parsedUrl.searchParams);
    const encodedQPArgs = searchParamsObject.toString();
    const decodedQPArgs = qString.decode(encodedQPArgs);
    return decodedQPArgs;
  }

  getRequestBody() {
    const encodedRequestBody = Object.keys(this.request.body)[0];
    var decodedRequestBodyString = Buffer.from(encodedRequestBody, "base64");
    const requestBodyObject = JSON.parse(decodedRequestBodyString.toString());
    return requestBodyObject;
  }

  getRandomId() {
    var randomId = uuid();
    return randomId;
  }

  async buildResponse(
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

    var reasons = reason;
    if (reason in ["undefined", null, "null"] || !Array.isArray(reason)) {
      reasons = [reason] || ["error"];
    }
    var message = httpStatus[`${statusCode}_MESSAGE`];
    var status = httpStatus[`${statusCode}_NAME`];
    var responseLength = values.length;

    var id = responseId || this.getRandomId();
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
  }

  async buildErrorReasons(result) {
    var errorTypeExpr = "$[*].name";
    var pathExpr = "$[*].path";
    var argsExpr = "$[*].argument";
    var errorTypes = jp.query(result || {}, errorTypeExpr);
    var path = jp.query(result || {}, pathExpr);
    var args = jp.query(result || {}, argsExpr);
    var reasons = [];
    var reason = {};
    for (var i = 0; i < errorTypes.length; i++) {
      var fieldName = args[i];
      var errorMsg = null;
      if (errorTypes[i] == "required") {
        errorMsg = `Field '${fieldName}' is required`;
        reason = { field: fieldName, error: errorMsg };
      } else if (errorTypes[i] == "additionalProperties") {
        errorMsg = `Additional field '${fieldName}' is not allowed`;
        reason = { field: fieldName, error: errorMsg };
      } else if (errorTypes[i] == "type") {
        // Iterate over the path & args fields for saving individual reason
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
  }

  getEndMessage(message, apiType, apiName) {
    var memoryUsed = main_utils.getMemoryUsage();
    var totalExecutionTime = Date.now() - this.request.requestTime;
    message = main_utils.format(message, [
      apiType,
      apiName,
      totalExecutionTime,
      memoryUsed,
    ]);
    return message;
  }

  getStartMessage() {
    var message = `Execution of ${this.request.method} ${this.request.path} begins`;
    return message;
  }

  ApiExecutionBegins() {
    var message = this.getStartMessage();
    logger.info(message);
  }

  ApiReportsError(error) {
    var message = `Execution of ${this.request.method} ${this.request.path} failed with error: ${error}`;
    logger.error(message);
  }

  ApiExecutionEnds() {
    var message = this.getEndMessage(
      ResponseIds.RI_005,
      this.request.method,
      this.request.path
    );
    logger.info(message);
  }
}

module.exports.AppResponse = AppResponse;
