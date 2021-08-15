var { validator } = require("./schema");
require("format-unicorn");
var requestTracer = require("cls-rtracer");
var lodash = require("lodash");
var consts = require("../../Configs/constants.config");

/**
 * @function format
 * @description used to format the string with the given formatSelectors
 * @param {String} message string to format with given formatSelectors
 * @param {Array} formatList formatSelectors
 */
module.exports.format = function (message, formatList) {
  var response = message;
  var formatSelector = {};
  for (var i = 0; i < formatList.length; i++) {
    formatSelector[i] = formatList[i];
  }
  response = response.formatUnicorn(formatSelector);
  return response;
};

module.exports.validatePayload = async function (payload, schema) {
  try {
    if (payload) {
      var result = validator.validate(payload, schema);
      return result.valid ? [true, null] : [false, result.errors];
    }
    return [false, []];
  } catch (ex) {
    throw ex;
  }
};

module.exports.processPayload = async function (payload) {
  var result = {};
  for (var key in payload) {
    if (payload.hasOwnProperty(key) && payload[key].length > 0) {
      result[key] = isNaN(payload[key]) ? payload[key] : parseInt(payload[key]);
    }
  }
  return result;
};

module.exports.getMemoryUsage = function () {
  var memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
  return memoryUsed;
};

module.exports.cloneObject = function (dataObject) {
  var copy = JSON.parse(JSON.stringify(dataObject || {}));
  return copy;
};

module.exports.getRequestId = function () {
  return requestTracer.id() || "main-thread";
};

/**
 * @middleware requestTime
 * @param {Object} req
 * @param {Object} res
 * @param {Callback} next
 * @description This middleware captures the timestamp when request comes to API. This is used to calculate the execution time of an API
 */
module.exports.requestTime = function (req, res, next) {
  var timestamp = Date.now();
  req.requestTime = timestamp;
  next();
};

module.exports.getFieldsAndValuesFromQpArgs = function (object) {
  var fields = [];
  var values = [];
  var tables = [];
  const OOB_KEYS = {
    "null": null,
    "undefined": undefined,
    "false": false,
    "true": true
  };
  var const_list = lodash.keys(consts.DATABASE.MAPPING);
  lodash.forOwn(object, function (value, property) {
    if (lodash.includes(const_list, property)) {
      fields.push(property);
      if (lodash.includes(lodash.keys(OOB_KEYS), value)) {
        values.push(OOB_KEYS[value]);
      } else {
        values.push(value);
      }
      tables.push(consts.DATABASE.MAPPING[property]);
    }
  });
  return [fields, values, tables];
};
