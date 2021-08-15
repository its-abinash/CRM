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
    "pattern": "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
    "default": ""
}

var chatPostReceiverSchema = {
    "$id": "/chatPostReceiverSchema",
    "type": "string",
    "title": "The receiver schema",
    "description": "The Receiver Schema",
    "pattern": "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$",
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
    "type": "string",
    "title": "The remfreq schema",
    "description": "remainderSchema",
    "default": "1"
}

var passwordSchema = {
    "$id": "/passwordSchema",
    "type": "string",
    "title": "The password schema",
    "description": "8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
    "pattern": "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{8,15}$"
}

var updatePayloadSchema = {
	"type": "object",
    "properties": {
      	"email": {"type": "string"},
    	"profile": {
    		"type": "object",
        	"properties" : {
        		"name": {"type": "string"},
                "password": {"type": "string"},
                "passcode": {"type": "string"},
        		"phone": {"type": "string"},
        		"remainder_freq": {"type": "integer"}
        	},
        	"additionalProperties": false,
            "required": ["name", "password", "passcode",
                         "phone", "remainder_freq"]
    	},
        "media": {
          	"type": "object",
            "properties": {
        		"profile_picture": {"type": "string"}
            },
            "additionalProperties": false,
            "required": ["profile_picture"]
        }
    },
  	"additionalProperties": false,
    "required": ["email", "profile", "media"]
}

var patchPayloadSchema = {
    "type": "object",
    "title": "The update Payload Schema",
    "description": "The root schema comprises the entire JSON document.",
    "anyOf" : [
        { "required": ["email", "name"] },
        { "required": ["email", "phone"] },
        { "required": ["email", "remainder_freq"] },
        { "required": ["email", "password"] },
        { "required": ["email", "passcode"] },
        { "required": ["email", "media"] },
        { "required": ["email", "name", "remainder_freq"] },
        { "required": ["email", "name", "phone"] },
        { "required": ["email", "name", "password"] },
        { "required": ["email", "name", "passcode"] },
        { "required": ["email", "name", "media"] },
        { "required": ["email", "phone", "remainder_freq"] },
        { "required": ["email", "phone", "password"] },
        { "required": ["email", "phone", "passcode"] },
        { "required": ["email", "phone", "media"] },
        { "required": ["email", "remainder_freq", "password"] },
        { "required": ["email", "remainder_freq", "passcode"] },
        { "required": ["email", "remainder_freq", "media"] },
        { "required": ["email", "password", "passcode"] },
        { "required": ["email", "password", "media"] },
        { "required": ["email", "passcode", "media"] },
        { "required": ["email", "name", "phone", "remainder_freq"] },
        { "required": ["email", "name", "phone", "password"] },
        { "required": ["email", "name", "phone", "passcode"] },
        { "required": ["email", "name", "phone", "media"] },
        { "required": ["email", "name", "password", "remainder_freq"] },
        { "required": ["email", "name", "passcode", "remainder_freq"] },
        { "required": ["email", "name", "media", "remainder_freq"] },
        { "required": ["email", "password", "phone", "remainder_freq"] },
        { "required": ["email", "passcode", "phone", "remainder_freq"] },
        { "required": ["email", "media", "phone", "remainder_freq"] },
        { "required": ["email", "password", "passcode", "remainder_freq"] },
        { "required": ["email", "media", "passcode", "remainder_freq"] },
        { "required": ["email", "media", "password", "remainder_freq"] },
        { "required": ["email", "name", "phone", "media",
                       "remainder_freq", "password", "passcode"] },
    ],
    "properties": {
        "name": {"type": "string"},
        "email": {"$ref": "/chatPostReceiverSchema"},
        "phone": {"$ref": "/phoneNumberSchema"},
        "password": {"type": "string"},
        "passcode": {"type": "string"},
        "remainder_freq": {"$ref": "/remainderSchema"},
        "media": {
            "type": "object",
            "properties": {
                "imagename": {"type": "string"},
                "lastModified": {"type": "string"},
                "size": {"type": "string"},
                "type": {"type": "string"}
            },
            "required": ["imagename", "lastModified", "size", "type"],
            "additionalProperties": false
        }
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
        "firstname",
        "lastname",
        "password"
    ],
    "properties": {
        "email": {"$ref": "/chatPostReceiverSchema"},
        "firstname": {"$ref": "/nameSchema"},
        "lastname": {"$ref": "/nameSchema"},
        "password": {"$ref": "/passwordSchema"},
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
