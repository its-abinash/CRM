const { createLogger, transports, format } = require("winston");
const { LOGGER } = require("../../Configs/constants.config");

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
      `[${info.timestamp} • ${currentTime()}] [${info.level}] | ${info.message}`
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
