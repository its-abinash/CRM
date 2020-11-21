const { createLogger, transports, format } = require("winston");
const { LOGGER } = require("../../Configs/constants.config");

var loggerFormat = format.combine(
  format.label({
    label: LOGGER.LABEL,
  }),
  format.timestamp({
    format: LOGGER.TIMESTAMP,
  }),
  format.printf(
    (info) =>
      `${info.label}  [${info.timestamp}]  [${info.level}] : ${info.message}`
  )
);

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
