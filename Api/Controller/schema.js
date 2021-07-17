var schemaValidator = require("jsonschema").Validator
var validator = new schemaValidator()

var responseIdSchema = {
    "$id": "/responseIdSchema",
    "type": "string",
    "title": "The responseId schema",
    "description": "This will be a base-64 string representing the responseId",
    "default": null
}

var defaultResponseSchema = {
    "$id": "/defaultResponseSchema",
    "responseId": null,
    "status": "BAD_GATEWAY",
    "statusCode": 500,
    "responseMessage": "",
    "values": [],
    "total": 0,
    "reasons": []
}

var statusSchema = {
    "$id": "/statusSchema",
    "type": "string",
    "title": "The status schema",
    "description": "HttpStatus name of the response",
    "default": "BAD_GATEWAY"
}

var statusCodeSchema = {
    "$id": "/statusCodeSchema",
    "type": "integer",
    "title": "The statusCode schema",
    "description": "HttpStatus Code",
    "default": 500
}

var responseMessageSchema = {
    "$id": "/responseMessageSchema",
    "type": "string",
    "title": "The responseMessage schema",
    "description": "Response Status short Description",
    "default": ""
}

var valuesSchema = {
    "$id": "/valuesSchema",
    "type": "array",
    "title": "The values schema",
    "description": "Response Data",
    "default": [],
    "additionalItems": true,
    "items": {
        "$id": "#/items"
    }
}

var totalItemSchema = {
    "$id": "/totalItemSchema",
    "type": "integer",
    "title": "The total schema",
    "description": "Total length of the response data",
    "default": 0
}

var reasonsSchema = {
    "$id": "/reasonsSchema",
    "type": "array",
    "title": "The reasons schema",
    "description": "Additional information with response",
    "default": [],
    "additionalItems": true,
    "items": {
        "$id": "#/items"
    }
}

var responseSchema = {
    "type": "object",
    "title": "Response Schema",
    "description": "The Response Schema comprises the entire JSON document.",
    "default": {"$ref": "/defaultResponseSchema"},
    "required": [
        "responseId",
        "status",
        "statusCode",
        "responseMessage",
        "values",
        "totalCount",
        "reasons"
    ],
    "properties": {
        "responseId": {"$ref": "/responseIdSchema"},
        "status": {"$ref": "/statusSchema"},
        "statusCode": {"$ref": "/statusCodeSchema"},
        "responseMessage": {"$ref": "/responseMessageSchema"},
        "values": {"$ref": "/valuesSchema"},
        "totalCount": {"$ref": "/totalItemSchema"},
        "reasons": {"$ref": "/reasonsSchema"}
    },
    "additionalProperties": false
}

var chatPostSenderSchema = {
    "$id": "/chatPostSenderSchema",
    "type": "string",
    "title": "The sender schema",
    "description": "Sender will be an user having a valid email id",
    "pattern": "^\\S+@\\S+[\\.][0-9a-z]+$",
    "default": ""
}

var chatPostReceiverSchema = {
    "$id": "/chatPostReceiverSchema",
    "type": "string",
    "title": "The receiver schema",
    "description": "The Receiver Schema",
    "pattern": "^\\S+@\\S+[\\.][0-9a-z]+$",
    "default": ""
}

var chatPostMessageSchema = {
    "$id": "/chatPostMessageSchema",
    "type": "string",
    "title": "The chatmsg schema",
    "description": "Text messages",
    "default": ""
}

var chatPostTimestampSchema = {
    "$id": "/chatPostTimestampSchema",
    "type": "number",
    "title": "The timestamp schema",
    "description": "timestamp",
    "default": ""
}

var defaultChatPostSchema = {
    "$id": "/defaultChatPostSchema",
    "receiver": "receiver@domain.com",
    "chatmsg": "test",
    "timestamp": "2021-01-13T20:18:33.843Z",
    "sender": "sender@domain.com",
}

var chatPostPayloadSchema = {
    "type": "object",
    "title": "The chatPostPayloadSchema schema",
    "description": "This is the POST /chat API request body schema",
    "default": {"$ref":"/defaultChatPostSchema"},
    "required": [
        "sender",
        "receiver",
        "chatmsg",
        "timestamp"
    ],
    "properties": {
        "sender": {"$ref": "/chatPostSenderSchema"},
        "receiver": {"$ref": "/chatPostReceiverSchema"},
        "chatmsg": {"$ref": "/chatPostMessageSchema"},
        "timestamp": {"$ref": "/chatPostTimestampSchema"}
    },
    "additionalProperties": false
}

var nameSchema = {
    "$id": "/nameSchema",
    "type": "string",
    "title": "The name schema",
    "description": "nameSchema",
    "default": "",
    "pattern": "^[\\p{L} .'-]+$"
}

var phoneNumberSchema = {
    "$id": "/phoneNumberSchema",
    "type": "string",
    "title": "The phone schema",
    "description": "phoneNumberSchema",
    "default": "",
    "pattern": "^(\\+\\d{1,3}[- ]?)?\\d{10}$"
}

var remainderSchema = {
    "$id": "/remainderSchema",
    "type": "integer",
    "title": "The remfreq schema",
    "description": "remainderSchema",
    "default": 1
}

var passwordSchema = {
    "$id": "/passwordSchema",
    "type": "string",
    "title": "The password schema",
    "description": "password validation schema",
    "pattern": "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$"
}

var updatePayloadSchema = {
    "type": "object",
    "title": "The update Payload Schema",
    "description": "The root schema comprises the entire JSON document.",
    "required": ["email", "name", "phone", "remfreq"],
    "properties": {
        "name": {"$ref": "/nameSchema"},
        "email": {"$ref": "/chatPostReceiverSchema"},
        "phone": {"$ref": "/phoneNumberSchema"},
        "remfreq": {"$ref": "/remainderSchema"}
    },
    "additionalProperties": false
}

var patchPayloadSchema = {
    "type": "object",
    "title": "The update Payload Schema",
    "description": "The root schema comprises the entire JSON document.",
    "anyOf" : [
        { "required": ["email", "name"] },
        { "required": ["email", "phone"] },
        { "required": ["email", "remfreq"] },
        { "required": ["email", "name", "remfreq"] },
        { "required": ["email", "name", "phone"] },
        { "required": ["email", "phone", "remfreq"] },
        { "required": ["email", "name", "phone", "remfreq"] },
    ],
    "properties": {
        "name": {"$ref": "/nameSchema"},
        "email": {"$ref": "/chatPostReceiverSchema"},
        "phone": {"$ref": "/phoneNumberSchema"},
        "remfreq": {"$ref": "/remainderSchema"}
    },
    "additionalProperties": false
}

var emailPayloadSchema = {
    "type": "object",
    "title": "The emailPayloadSchema",
    "description": "emailPayloadSchema",
    "required": [
        "from",
        "to",
        "subject",
        "text"
    ],
    "properties": {
        "from": {"$ref": "/chatPostReceiverSchema"},
        "to": {"$ref": "/chatPostReceiverSchema"},
        "subject": {"$ref": "/chatPostMessageSchema"},
        "text": {"$ref": "chatPostMessageSchema"}
    },
    "additionalProperties": false
}

var registrationSchema = {
    "type": "object",
    "title": "registrationSchema",
    "description": "registrationSchema",
    "required": [
        "email",
        "username",
        "phonenum",
        "gstnum",
        "remfreq",
        "password",
        "passcode"
    ],
    "properties": {
        "email": {"$ref": "/chatPostReceiverSchema"},
        "username": {"$ref": "/nameSchema"},
        "phonenum": {"$ref": "/phoneNumberSchema"},
        "gstnum": {"$ref": "/chatPostMessageSchema"},
        "remfreq": {"$ref": "/remainderSchema"},
        "password": {"$ref": "/passwordSchema"},
        "passcode": {"$ref": "/chatPostMessageSchema"}
    },
    "additionalProperties": false
}

var loginPayloadSchema = {
    "type": "object",
    "title": "loginPayloadSchema",
    "description": "loginPayloadSchema",
    "required": [
        "email",
        "password"
    ],
    "properties": {
        "email": {"$ref": "/chatPostReceiverSchema"},
        "password": {"$ref": "/passwordSchema"}
    },
    "additionalProperties": false
}

// below schema is a deep copy of the updatePayloadSchema
var insertPayloadSchema = JSON.parse(JSON.stringify(updatePayloadSchema))
insertPayloadSchema["required"] = ["email", "name", "phone", "remfreq", "gst"]
insertPayloadSchema["properties"]["gst"] = {"$ref": "/chatPostMessageSchema"}

validator.addSchema(responseIdSchema, "/responseIdSchema")
validator.addSchema(defaultResponseSchema, "/defaultResponseSchema")
validator.addSchema(statusSchema, "/statusSchema")
validator.addSchema(statusCodeSchema, "/statusCodeSchema")
validator.addSchema(responseMessageSchema, "/responseMessageSchema")
validator.addSchema(valuesSchema, "/valuesSchema")
validator.addSchema(totalItemSchema, "/totalItemSchema")
validator.addSchema(reasonsSchema, "/reasonsSchema")
validator.addSchema(chatPostSenderSchema, "/chatPostSenderSchema")
validator.addSchema(chatPostReceiverSchema, "/chatPostReceiverSchema")
validator.addSchema(chatPostMessageSchema, "/chatPostMessageSchema")
validator.addSchema(chatPostTimestampSchema, "/chatPostTimestampSchema")
validator.addSchema(defaultChatPostSchema, "/defaultChatPostSchema")
validator.addSchema(nameSchema, "/nameSchema")
validator.addSchema(phoneNumberSchema, "/phoneNumberSchema")
validator.addSchema(remainderSchema, "/remainderSchema")
validator.addSchema(passwordSchema, "/passwordSchema")

module.exports.responseSchema = responseSchema
module.exports.chatPostPayloadSchema = chatPostPayloadSchema
module.exports.updatePayloadSchema = updatePayloadSchema
module.exports.insertPayloadSchema = insertPayloadSchema
module.exports.emailPayloadSchema = emailPayloadSchema
module.exports.validator = validator
module.exports.registrationSchema = registrationSchema
module.exports.loginPayloadSchema = loginPayloadSchema
module.exports.patchPayloadSchema = patchPayloadSchema
