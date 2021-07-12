const { createLogger, transports, format } = require("winston");
const { LOGGER } = require("../../Configs/constants.config");
const { getRequestId } = require("../Controller/main_utils");

var timeZoned = function () {
  return new Date().toLocaleDateString({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};

var currentTime = function () {
  return new Date().toLocaleTimeString("En");
};

/**
 * @constant
 * @description Logger Formats
 */
var loggerFormat = format.combine(
  format.timestamp({
    format: timeZoned,
  }),
  format.printf(
    (info) =>
      `[${info.timestamp} • ${currentTime()}] [${info.level}] | ${getRequestId()} | ${info.message}`
  )
);

/**
 * @template
 * @description Logger Template
 */
module.exports = createLogger({
  transports: [
    new transports.File({
      filename: LOGGER.LOG_PATH,
      level: LOGGER.LEVEL,
      format: loggerFormat,
      handleExceptions: true,
      maxsize: LOGGER.LOG_SIZE,
    }),
  ],
});

module.exports.currentTime = currentTime;
module.exports.timeZoned = timeZoned;
