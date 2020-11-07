const { createLogger, transports, format } = require('winston');

module.exports = createLogger({
    transports : [
        new transports.File({
            filename : 'logs/app.log',
            level : 'info',
            format : format.simple(),
            handleExceptions: true,
            json: true,
            maxsize: 5242880 // 5 MB
        })
    ]
})