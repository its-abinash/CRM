var httpStatus = require("http-status");
var logger = require("../Logger/log");
var main_utils = require("./main_utils");
var jp = require("jsonpath");
var { v4: uuid } = require("uuid");
var { ResponseIds } = require("../../Configs/constants.config");
const CryptoJs = require("crypto-js");
const _ = require("lodash");

const ACCESS_TOKEN = "x-access-token";
const HEADERS = "headers";

class AppResponse {
  constructor(request = null) {
    this.request = request || {};
  }

  destroySession() {
    var result = {
      auth: false,
      token: null,
    };
    return result;
  }

  decryptKey(key) {
    var wordArray = CryptoJs.AES.decrypt(key, "#");
    var utf8String = wordArray.toString(CryptoJs.enc.Utf8);
    try {
      var obj = JSON.parse(utf8String);
      return obj;
    } catch (exc) {
      return utf8String;
    }
  }

  encryptKey(key) {
    var encryptedKey = CryptoJs.AES.encrypt(
      JSON.stringify(key),
      "#"
    ).toString();
    return encryptedKey;
  }

  encryptKeyStable(key) {
    // This function encrypts key by ensuring that the encrypted key must remain same
    // if the same key is encrypted again by this function
    var encryptedKey = Buffer.from(String(key)).toString("base64");
    return encryptedKey;
  }

  decryptKeyStable(key) {
    // NOTE: This method decrypts key which is encoded by encryptKeyStable() function
    var decryptedKey = Buffer.from(String(key), "base64").toString();
    return decryptedKey;
  }

  getAccessToken() {
    if (HEADERS in this.request && ACCESS_TOKEN in this.request.headers) {
      return this.request.headers[ACCESS_TOKEN];
    }
    return null;
  }

  getQueryParams() {
    const req = this.request;
    const encodedReqUrl = _.toString(req.originalUrl);
    const encodedParams = encodedReqUrl.slice(encodedReqUrl.indexOf("?") + 1);
    if (encodedParams === "") {
      return {};
    }
    const decodedParams = this.decryptKey(encodedParams);
    if (!decodedParams) {
      return {};
    }
    var decodedQueryParams = _.chain(decodedParams) // foo=bar&new=watch
      .split("&")                           // ["foo=bar", "new=watch"]
      .map(_.partial(_.split, _, "=", 2))   // [["foo", "bar"], ["new", "watch"]]
      .fromPairs()                          // {"foo": "bar", "new": "watch"}
      .value();
    return decodedQueryParams;
  }

  getCommaSepPathParams() {
    const req = this.request;
    const params = req.params;
    for (const eachPathParam in params) {
      const decodedPathParams = this.decryptKey(params[eachPathParam]);
      params[eachPathParam] = decodedPathParams[eachPathParam].split(",");
    }
    return params;
  }

  getRequestBody() {
    var encodedRequestBody = this.request.body.payload;
    var requestBodyObject = this.decryptKey(encodedRequestBody);
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
    responseId = null,
    translateCodes = []
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

    var reasons = [];
    if (reason in ["undefined", null] || !Array.isArray(reason)) {
      reasons = [reason] || ["error"];
    }
    if(Array.isArray(reason)) {
      reasons = [...reasons, ...reason]
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
      translateCodes: translateCodes
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
        for (var field = 0; path[i] && field < path[i].length; field++) {
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
    var message = `Execution of ${this.request.method} ${this.request.originalUrl} begins`;
    return message;
  }

  ApiExecutionBegins() {
    var message = this.getStartMessage();
    logger.info(message);
  }

  ApiReportsError(error) {
    const req = this.request;
    const OOB_ERRORS_LIST = [
      Error,
      EvalError,
      RangeError,
      ReferenceError,
      SyntaxError,
      TypeError,
      URIError,
    ];
    var errMsg = error; // Considering error is a String and does not belong to any OOB errors
    var errType = "Error"; // Common Error
    for (const eachError of OOB_ERRORS_LIST) {
      if (error instanceof eachError) {
        errMsg = error.message;
        errType = error.name;
        break;
      }
    }
    var message = `Execution of ${req.method} ${req.path} failed with ${String(
      errType
    )}: ${errMsg}`;
    logger.error(message);
    logger.error(`${error.stack}`);
  }

  ApiExecutionEnds() {
    var message = this.getEndMessage(
      ResponseIds.RI_005,
      this.request.method,
      this.request.path
    );
    logger.info(message);
  }

  getRequestHeaders() {
    var headers = _.has(this.request, "headers") ? this.request.headers : {};
    return headers;
  }

  getLocale() {
    var requestHeaders = this.getRequestHeaders();
    var AcceptLang = requestHeaders["accept-language"]
    if(!AcceptLang) {
      return "en-US";
    }
    var LangList = _.split(AcceptLang, ',')
    var locale = LangList[0];
    return locale
  }
}

module.exports.AppResponse = AppResponse;
