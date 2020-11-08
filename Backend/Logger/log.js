const { createLogger, transports, format } = require('winston');

var loggerFormat = format.combine(
    format.label({
        label:'[LOG]'
    }),
    format.timestamp({
        format:"DD-MM-YY HH:MM:SS"
    }),
    format.printf(
        info => `${info.label}  [${info.timestamp}]  [${info.level}] : ${info.message}`
    )
);

module.exports = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/app.log',
            level : 'info',
            format : loggerFormat,
            handleExceptions: true,
            maxsize: 5242880 // 5 MB
        })
    ]
})