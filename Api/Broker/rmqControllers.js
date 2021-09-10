const { consumer } = require("./rmq.consumer")
const { sendEmailUtil } = require("../Controller/emailService")

module.exports.RMQ_CONFIGS = [
    {
        "purpose": "email",
        "queuename": "crm_sync",
        "exchangename": "default",
        "routingkey": "crm_sync.*",
        "socketname": "CrmSync",
        "exchangetype": "topic",
        "consumercallback": consumer,
        "callback": sendEmailUtil
    }
]