module.exports.fakeServer = "http://localhost:3000";

module.exports.fakeChatPOSTRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  session: {
    user: "sender@gmail.com",
    password: "password",
  },
  loggedInUser: "loggedInUser",
  originalUrl: "?U2FsdGVkX185+ZUftaKEvQvAhiIzRY3QlcQSUAntlBA=",
  body: {
    "payload": "U2FsdGVkX19gTxvETA5pwvCzaFwFATnzvth3aNVVk2Vs/yWuxbheVIfxZG03hl/wLKBsWqKKSGQzq2+AeHa9CJNMAIoeKUXhYdnIbAePkgXm2zv6HEEg29X2pauJDf3QoX5w27cs/iqKQcZmXHOD6A=="
  },
};

module.exports.GetNotificationRequest = {
  path: "/notifications",
  method: "GET",
  headers: {"x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX"},
  params: {
    "userIds": "U2FsdGVkX1+v91wqk9V1YzDMnJJEUZqDMCuJEYjB7svxxL8G+ClQzuNNSEgRZtXtdYcXE24t9vum8RwdcYOB1ga17yPZXr2k/eS3RfDP+jg="
  }
}

module.exports.getNotificationsResponse = {
  responseId: 'aaef2374-bcb8-4d28-aa14-46ccb9a59b39',
  status: 'OK',
  statusCode: 200,
  responseMessage: 'Standard response for successful HTTP requests.',
  values: [
    'U2FsdGVkX19hCoVARr1klPtaLWUHoEl3Fs/NnRZJ1yX7sO9AixhXr7y4Tn45Z/6m63+s/5/yfFy2LTXKw6zNb3E82yIot5Thzoqw06uoNrgUdRGhKuYcRAiEOdTOIRRF'
  ],
  totalCount: 1,
  reasons: [ '' ]
}

module.exports.fakeRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
};

module.exports.fakeResponse = {
  send: function (data) {
    this.response = data;
    return this;
  },
  status: function (s) {
    this.statusCode = parseInt(s);
    return this;
  },
  statusCode: 200,
  response: {},
  render: function () {},
  redirect: function () {},
  cookie: function () {}
};

// status(200).send

module.exports.fakeGETChatRequest = {
  session: {
    user: "fake_user@gmail.com",
  },
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  params: {
    senderId: "c2VuZGVyQGdtYWlsLmNvbQ==",
    receiverId: "cmVjZWl2ZXJAZ21haWwuY29t",
  },
  path: "/chat",
  method: "fake_method",
};

module.exports.fakeGETChatRequest2 = {
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  params: {
    senderId: "c2VuZGVyQGdtYWlsLmNvbQ==",
    receiverId: "cmVjZWl2ZXJAZ21haWwuY29t",
  },
  loggedInUser: "loginuser_fake_email_id",
  path: "/chat",
  method: "POST",
};

module.exports.fakeChatData = [
  {
    sender: "U2FsdGVkX1+j0LIA57jQBkLANfOUR0Pd0GuiRa5btOMHKLvdZ9FCfixN6Tls4LML",
    receiver: "U2FsdGVkX1/bQP3AECm5O9bkvQy6vNK9wk39baqrU2eMNLdfJmvrd5Bv0r8TY7ik",
    msg: "U2FsdGVkX1/0568a5bCQKN4RqauV23i4IdFIMsCwIAA=",
    timestamp: "12345",
    image: "some encoded string"
  },
];
module.exports.fakeChatData1 = [
  {
    sender: "U2FsdGVkX1+j0LIA57jQBkLANfOUR0Pd0GuiRa5btOMHKLvdZ9FCfixN6Tls4LML",
    receiver: "U2FsdGVkX1/bQP3AECm5O9bkvQy6vNK9wk39baqrU2eMNLdfJmvrd5Bv0r8TY7ik",
    msg: "U2FsdGVkX1/0568a5bCQKN4RqauV23i4IdFIMsCwIAA=",
    timestamp: "12346",
    image: "some encoded string"
  },
];

module.exports.fakeChatResponse = {
  responseId: "RI_001",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      sender: "U2FsdGVkX1+j0LIA57jQBkLANfOUR0Pd0GuiRa5btOMHKLvdZ9FCfixN6Tls4LML",
      receiver: "U2FsdGVkX1/bQP3AECm5O9bkvQy6vNK9wk39baqrU2eMNLdfJmvrd5Bv0r8TY7ik",
      msg: "U2FsdGVkX1/0568a5bCQKN4RqauV23i4IdFIMsCwIAA=",
      timestamp: "3:39:50 PM",
    },
    {
      sender: "U2FsdGVkX1+j0LIA57jQBkLANfOUR0Pd0GuiRa5btOMHKLvdZ9FCfixN6Tls4LML",
      receiver: "U2FsdGVkX1/bQP3AECm5O9bkvQy6vNK9wk39baqrU2eMNLdfJmvrd5Bv0r8TY7ik",
      msg: "U2FsdGVkX1/0568a5bCQKN4RqauV23i4IdFIMsCwIAA=",
      timestamp: "3:39:50 PM",
    },
  ],
  totalCount: 1,
  reasons: [
    "Conversations between userId: fake_user@gmail.com and userId: fake_receiver@gmail.com are successfully retrieved",
  ],
};

module.exports.fakeChatResponse2 = {
  statusCode: 200,
};

module.exports.fakeChatResponse3 = {
  statusCode: 401,
};

module.exports.fakeResponseWithException = {
  responseId: "c93mj8-ivym9r-lvxmb5",
  status: "BAD_GATEWAY",
  statusCode: 502,
  responseMessage:
    "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
  values: [],
  totalCount: 0,
  reasons: ["exception"],
};

module.exports.fakeChatPOSTResponse = {
  responseId: "RI_003",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [],
  totalCount: 0,
  reasons: [
    "Conversations between userId: sender@gmail.com and userId: receiver@gmail.com are successfully inserted in Database",
  ],
};

module.exports.fakeChatPayloadErrorResponse = {
  responseId: "RI_004",
  status: "UNPROCESSABLE_ENTITY",
  statusCode: 422,
  responseMessage:
    "The request was well-formed but was unable to be followed due to semantic errors.",
  values: [],
  totalCount: 0,
  reasons: [],
};

module.exports.fakeChatExceptionResponse = {
  responseId: "a5rva1-szja3m-sd6vya",
  status: "INTERNAL_SERVER_ERROR",
  statusCode: 500,
  responseMessage:
    "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
  values: [],
  totalCount: 0,
  reasons: ["exception"],
};

module.exports.fakeChatErrorResponse = {
  responseId: "RI_002",
  status: "BAD_REQUEST",
  statusCode: 400,
  responseMessage:
    "The server cannot or will not process the request due to an apparent client error.",
  values: [],
  totalCount: 0,
  reasons: [
    "Error from database while saving conversation between userId: sender@gmail.com and userId: $receiver@gmail.com",
  ],
};

module.exports.fakeDeleteUserRequest = {
  path: "/fake_path",
  method: "fake_api",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  body: {
    "payload": "U2FsdGVkX19FKrxTprxbiqvhkThZ+eXNSLd7+i6/wPwtZZIqvt9lNLR1Z8FYOX1p"
  },
  session: {
    user: "admin@gmail.com",
  },
};

module.exports.fakeBuildResponse1 = {
  responseId: "fake_responseId",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: ["fake_data"],
  totalCount: 1,
  reasons: ["fake_reasons"],
};

module.exports.fakeBuildResponse2 = {
  responseId: "fake_responseId",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [],
  totalCount: 0,
  reasons: [null],
};

module.exports.fakeBuildResponse3 = {
  responseId: "fake_responseId",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: ["fake_data"],
  totalCount: 1,
  reasons: [null],
};

module.exports.fakeBuildResponse4 = {
  responseId: "fake_responseId",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [{ key: "fake_data" }],
  totalCount: 1,
  reasons: [null],
};

module.exports.fakeBuildErrorReasonsPayload = [
  {
    path: [],
    name: "required",
    argument: "gst",
  },
  {
    path: ["name"],
    name: "type",
    argument: ["string"],
  },
  {
    path: [],
    name: "additionalProperties",
    argument: "fakeKey",
  },
];

module.exports.fakeBuildErrorReasons = [
  { field: "gst", error: "Field 'gst' is required" },
  { field: "name", error: "Field 'name' is not a type(s) of string" },
  {
    field: "fakeKey",
    error: "Additional field 'fakeKey' is not allowed",
  },
];

module.exports.fakeCredData = [
  {
    email: "u1@gmail.com",
    password: "pass1",
    passcode: "passc1",
    is_admin: true,
  },
  {
    email: "u2@gmail.com",
    password: "pass2",
    passcode: "passc2",
    is_admin: false,
  },
];

module.exports.specificCredData = [
  {
    email: "u1@gmail.com",
    password: "pass1",
    passcode: "passc1",
    is_admin: true,
  },
];

module.exports.fakeCustomerData = [
  {
    name: "c1_name1",
    email: "c1@gmail.com",
    phone: "1234568484",
    gst: "jdbdhbdhd",
    remfreq: 2,
    next_remainder: "20/12/2020",
  },
  {
    name: "c2_name1",
    email: "c2@gmail.com",
    phone: "7543223433",
    gst: "4f45bdhbdhd",
    remfreq: 5,
    next_remainder: "23/01/2021",
  },
];

module.exports.fakeSpecificCustomerData = [
  {
    name: "c1_name1",
    email: "c1@gmail.com",
    phone: "1234568484",
    gst: "jdbdhbdhd",
    remfreq: 2,
    next_remainder: "20/12/2020",
  },
];

module.exports.fakeConversationData = [
  {
    sender: "s1@gmail.com",
    receiver: "r1@gmail.com",
    msg: "msg",
    timestamp: "2021-01-23 18:52:44.0853+05:30",
  },
  {
    sender: "s2@gmail.com",
    receiver: "r2@gmail.com",
    msg: "msg",
    timestamp: "2021-01-23 18:52:44.0853+05:30",
  },
];

module.exports.fakeSpecificConversationData = [
  {
    sender: "s1@gmail.com",
    receiver: "r1@gmail.com",
    msg: "msg",
    timestamp: "2021-01-23 18:52:44.0853+05:30",
  },
];

module.exports.fakeLatestRemainderData = [
  {
    email: "c1@gmail.com",
    remfreq: 2,
  },
];

module.exports.fakeEditRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  body: {
    "payload": "U2FsdGVkX1/osmj6wZoHLO99opunVdrLsG0Th71ob2T/gMCjUlNaLlt3oF30ziYdP0y4WM1FJcdOEtIj56Izz7VqoPoksQrDYN2dgpWV4sBSMo+j5MPZaVAy3QYKaFBAF5+ueXn+UbQXeNagexoi58uSh6/o7XtC+vW2KSkUVZLSFgpO/ts35EJSnrhEYoXksjIJxUQYibB70hZY6jWkijSJrZBXXikcSryF6L2r+SkHMI8cW3xDX119aUS6BDwStrZGGuImQO2GBdFLBge6+g79aUum41R40E0CzTjMX2OVuz/GnPoBVa0UepQnD/cL"
  },
};

module.exports.fakePatchRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  originalUrl: "/edit?U2FsdGVkX19V1+/i6aWXl4N29DXsRZ3qbQBP14Hn1RbQbu76DvwsDUoAqDkpUVY1PpYPMxoY777m0mIjkUv9E0sbb3U/TtM+GqKGwFYMDm4=",
  protocol: "http",
  get: function(host) {
    return "localhost";
  }
};

module.exports.fakeEmailRequest = {
  session: {
    user: "sender@gmail.com",
  },
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  body: {
    "payload": "U2FsdGVkX1+0w9xkFT/qO08+/ICDI721xonDrl1HMkrw1lXusFBWqOmN0qa5ViQe3Ljgtf+7y6C//ef1bBpHLSTBiHohm1KYJyB0Rjn8Kjs8ZBwEMJG33Cgel0hj+p3+"
  },
  path: "/fake_path",
  method: "fake_method",
};

module.exports.fakeEmailResponse = {
  responseId: 'RI_035',
  status: 'ACCEPTED',
  statusCode: 202,
  responseMessage: 'The request has been accepted for processing, but the processing has not been completed.',
  values: [],
  totalCount: 0,
  reasons: [
    'Request has been accepted, please check notifications for the updates'
  ]
}

module.exports.emailWrongPayloadResponse = {
  responseId: "RI_004",
  status: "UNPROCESSABLE_ENTITY",
  statusCode: 422,
  responseMessage:
    "The request was well-formed but was unable to be followed due to semantic errors.",
  values: [],
  totalCount: 0,
  reasons: [],
};

module.exports.emailExceptionResponse = {
  responseId: "RI_014",
  status: "BAD_REQUEST",
  statusCode: 400,
  responseMessage:
    "The server cannot or will not process the request due to an apparent client error.",
  values: [],
  totalCount: 0,
  reasons: ["Failed to send email to user with userId: receiver@gmail.com"],
};

module.exports.fakeConstants = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      CYPHER: {
        ENCRYPTIONKEY: "#",
        DECRYPTIONKEY: "#",
      },
      ROUTES: {
        HOME: "home",
        LANDINGPAGE: "landingPage",
        LOGOUT: "logout",
        REG: "register",
        LOGIN: "login",
        CONTACT: "contact",
        EDIT: "edit",
        ADD: "insert",
        UPLOAD: "insert/profilePicture",
        DELETE: "deleteUser",
        EMAIL: "email",
        CHAT: "chat",
        DASHBOARD: {
          CUSTOMER: "dashboard/getCustomer",
          ADMIN: "dashboard/getAdmins",
        },
      },
    },
  ],
  totalCount: 1,
  reasons: [
    'Successfully fetched the Constants',
  ],
};

module.exports.getConstantsExceptionResponse = {
  responseId: 'RI_015',
  status: 'BAD_REQUEST',
  statusCode: 400,
  responseMessage: 'The server cannot or will not process the request due to an apparent client error.',
  values: [],
  totalCount: 0,
  reasons: [ 'User has logged-out or session has expired for the user' ]
}

module.exports.getSpecificFromConstantsRequest = {
  params: {
    constId: "ROUTES",
    fieldId: "REG",
  },
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  session: {
    user: "sender@gmail.com",
    password: "pass",
  },
  body: {
    email: "receiver@gmail.com",
    subject: "sub",
    body: "body",
  },
  path: "/fake_path",
  method: "fake_method",
};

module.exports.getSpecificFromConstantsResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: ["register"],
  totalCount: 1,
  reasons: ["Successfully fetched the Constant"],
};

module.exports.fakeLatestRemainderData = [
  {
    email: "demo1@gmail.com",
    remfreq: 1,
  },
  {
    email: "demo2@gmail.com",
    remfreq: 2,
  },
];

module.exports.fakeRemainderResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [],
  totalCount: 0,
  reasons: [
    'Successfully fetched the remainder information',
  ],
};

module.exports.JWTAuthSuccessResponse = {
  responseId: 'RI_024',
  status: 'OK',
  statusCode: 200,
  responseMessage: 'Standard response for successful HTTP requests.',
  values: [ 'fake_token' ],
  totalCount: 1,
  reasons: [ 'Successfully authenticated token' ]
}

module.exports.JWTAuthFailureResponse = {
  responseId: 'RI_023',
  status: 'BAD_REQUEST',
  statusCode: 400,
  responseMessage: 'The server cannot or will not process the request due to an apparent client error.',
  values: [],
  totalCount: 0,
  reasons: [ 'Failed to authenticate token' ]
}

module.exports.JWTUserAuthErrorResponse = {
  responseId: 'RI_015',
  status: 'UNAUTHORIZED',
  statusCode: 401,
  responseMessage: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
  values: [],
  totalCount: 0,
  reasons: [ 'User has logged-out or session has expired for the user' ]
}

module.exports.fakeUserTypeResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [true],
  totalCount: 1,
  reasons: ["Successfully fetched the is_admin flag"],
};

module.exports.fakeLoginUserResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: ["sender@gmail.com"],
  totalCount: 1,
  reasons: [
    "Successfully fetched the login user",
  ],
};

module.exports.fakeLoginUserExpResponse = {
  responseId: "RI_015",
  status: "UNAUTHORIZED",
  statusCode: 401,
  responseMessage:
    "Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.",
  values: [],
  totalCount: 0,
  reasons: ["User has logged-out or session has expired for the user"],
};

module.exports.fakeInsertPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    user: "sender@gmail.com",
  },
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  body: {
    "payload": "U2FsdGVkX1/3cNu05aMEdZg7caIhuU/qmDkttcufu+kMu4Yjd1k0ZH9Ew2XBpZEDryPk+FU0/V+ud0jRjtQvph1oLsUhRpkbbq4yvA6DQ81tXws2smNkbMc8coknxoHBPEOI6j94dlJWgWzrrUqC8g=="
  },
};

module.exports.fakeInsertPayloadRequest2 = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    user: "sender@gmail.com",
  },
  file: {
    mimetype: "image/png",
    buffer: [1, 2, 3],
  },
};

module.exports.insertSuccessfulResponse1 = {
  responseId: "RI_011",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [],
  totalCount: 0,
  reasons: [
    "Successfully inserted Profile Picture of userId: sender@gmail.com",
  ],
};

module.exports.insertProfilePictureFailureRes = {
  responseId: "RI_012",
  status: "BAD_REQUEST",
  statusCode: 400,
  responseMessage:
    "The server cannot or will not process the request due to an apparent client error.",
  values: [],
  totalCount: 0,
  reasons: [
    "Failed to insert Profile Picture of userId: sender@gmail.com",
  ],
};

module.exports.insertSuccessfulResponse = {
  responseId: "RI_011",
  status: "CREATED",
  statusCode: 201,
  responseMessage:
    "The request has been fulfilled, resulting in the creation of a new resource.",
  values: [],
  totalCount: 0,
  reasons: ["Successfully inserted data of userId: c1@gmail.com"],
};

module.exports.insertFailureResponse = {
  responseId: "RI_012",
  status: "BAD_REQUEST",
  statusCode: 400,
  responseMessage:
    "The server cannot or will not process the request due to an apparent client error.",
  values: [],
  totalCount: 0,
  reasons: ["Failed to insert data of userId: c1@gmail.com"],
};

module.exports.loginPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  session: {
    user: "sender@gmail.com",
    password: "pass",
  },
  params: {
    userId: "sender@gmail.com"
  },
  body: {
    "payload": "U2FsdGVkX1+WXa4uthXqvrCDKBwsXsJ5ia2O0bO2Ke0sBIGV662EOcQCBPbyFgEXRMHQWSsCwnbGfcYZy6dBCKdt64rV64csyIOkPiWPwQs="
  },
};

module.exports.loginSuccessResponse = {
  responseId: 'RI_019',
  status: 'OK',
  statusCode: 200,
  responseMessage: 'Standard response for successful HTTP requests.',
  values: [
    {
      auth: true,
      token: 'XXXXXX.XXXXXXX.XXXXXX'
    }
  ],
  totalCount: 1,
  reasons: [ 'User: c1@gmail.com has successfully logged-in' ]
}

module.exports.loginPayloadValidationErrorResponse = {
  responseId: 'RI_004',
  status: 'UNPROCESSABLE_ENTITY',
  statusCode: 422,
  responseMessage: 'The request was well-formed but was unable to be followed due to semantic errors.',
  values: [ { auth: false, token: null } ],
  totalCount: 1,
  reasons: []
}

module.exports.loginUserValidationErrorResponse = {
  responseId: 'RI_021',
  status: 'BAD_REQUEST',
  statusCode: 400,
  responseMessage: 'The server cannot or will not process the request due to an apparent client error.',
  values: [ { auth: false, token: null } ],
  totalCount: 1,
  reasons: [
    'Failed to logging in user: user@gmail.com, due to error: Wrong userId or Password'
  ]
}

module.exports.loginExceptionResponse = {
  responseId: 'RI_020',
  status: 'INTERNAL_SERVER_ERROR',
  statusCode: 500,
  responseMessage: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
  values: [ { auth: false, token: null } ],
  totalCount: 1,
  reasons: [
    'Getting exception: user@gmail.com while logging in user: Error: fake_exp'
  ]
}

module.exports.registerPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  headers: {
    "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
  },
  body: {
    "payload": "U2FsdGVkX1+/PK/jN8hKQh/gJdb8RqRxilhwAXIVwO8AzrHEytZDtCCVM4s9NIMA0H3O0dYVL+nTt6MqVHB85o9JAf121UY/mtLNayMmgbseLOplme4tt5djBhpJN4TyWiQNxQYnPEg0L7qmrY+YaUYZplzLwU0AIDBa5sd8UDE="
  },
};

module.exports.registerSuccessResponse = {
  responseId: 'RI_016',
  status: 'CREATED',
  statusCode: 201,
  responseMessage: 'The request has been fulfilled, resulting in the creation of a new resource.',
  values: [],
  totalCount: 0,
  reasons: [ 'User: abinashbiswal248@gmail.com has successfully registered' ]
}

module.exports.registerPayloadValidationErrorResponse = {
  responseId: 'RI_004',
  status: 'UNPROCESSABLE_ENTITY',
  statusCode: 422,
  responseMessage: 'The request was well-formed but was unable to be followed due to semantic errors.',
  values: [],
  totalCount: 0,
  reasons: []
}

module.exports.registrationFailureResponse = {
  responseId: 'RI_018',
  status: 'BAD_REQUEST',
  statusCode: 400,
  responseMessage: 'The server cannot or will not process the request due to an apparent client error.',
  values: [],
  totalCount: 0,
  reasons: [
    'Failed to register user: abinashbiswal248@gmail.com, due to error: error saving userdata in our databse'
  ]
}

module.exports.registerExceptionResponse = {
  responseId: 'RI_017',
  status: 'INTERNAL_SERVER_ERROR',
  statusCode: 500,
  responseMessage: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
  values: [],
  totalCount: 0,
  reasons: [
    'Getting exception: abinashbiswal248@gmail.com while registering user: Error: fake_exp'
  ]
}

module.exports.fakeGetQuoteRequest1 = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    // <- Valid session values
    user: "user@gmail.com",
    password: "password",
  },
};

module.exports.fakeGetQuoteRequest2 = {
  path: "/fake_path",
  method: "fake_method",
  session: {}, // <- Empty session values
};

module.exports.fakeGetProfilePicResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [{ name: "fake_name", url: "fake_url" }],
  totalCount: 1,
  reasons: ["Successfully fetched the Img Data"],
};

module.exports.fakeGetProfilePicResponse2 = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [ { name: 'Abinash Biswal', url: null } ],
  totalCount: 1,
  reasons: [
    "Successfully fetched the Img Data",
  ],
};

module.exports.encodedChatPayload = "U2FsdGVkX1/md7zKi591WVz4Y0ylern4Xbl0DKLagMDTfXoyChlNZBx+2DLACxiGSrtFvAtbmnfigu/9m6txfJ11yYM0H88xmjV0PMGJ56MG5TaSvuSifqca/7CHWYlGZOD3E06ezSCnET8Kz+zBufOdgsPq14ZU29QAScwhaRO83YmYz3QZPDNFxwxvcjg+qRTm2nU0mCF0B7ykvsLXGMVP4F7mJEEW2iSVwpvsVV1+4YUGkRwMR3m1kS5+wwZIrPOzE2d9VUV81eku4CKMBA=="

module.exports.userInfoResponse = {
  "responseId":"RI_006",
  "status":"OK",
  "statusCode":200,
  "responseMessage":"Standard response for successful HTTP requests.",
  "values":[
    {
      "media":{
        "image":"img_data",
        "size":"1024",
        "lastmodified":"12345",
        "type":"img/jpeg",
        "imagename":"2021-01-05.jpeg"
      },
      "email":"abinashbiswal248@gmail.com",
      "name":"Abinash Biswal",
      "firstname":"Abinash",
      "lastname":"Biswal",
      "phone":"1234567890"
    }
  ],
  "totalCount":1,
  "reasons":["Successfully fetched the user information"]
}

module.exports.deleteUserDataResp = {
  responseId: 'RI_007',
  status: 'OK',
  statusCode: 200,
  responseMessage: 'Standard response for successful HTTP requests.',
  values: [],
  totalCount: 0,
  reasons: [
    'Successfully removed image of userId: sender@gmail.com'
  ]
}

module.exports.fakeAdminData = {
  email: "fakeemail@gmail.com",
  name: "fakeadmin",
  image: "base64 data"
}

module.exports.fakeCustmerData = {
  email: "fakeemail@gmail.com",
  name: "fakecustomer",
  image: "base64 data"
}

module.exports.allUsers = [
  {
    email: "user1@gmail.com",
    name: "user1"
  },
  {
    email: "fakeemail@gmail.com",
    name: "fakecustomer"
  }
]

module.exports.fakeGetAllUsersResp1 = {
  responseId: 'RI_006',
  status: 'OK',
  statusCode: 200,
  responseMessage: 'Standard response for successful HTTP requests.',
  values: [
    { email: 'fakeemail@gmail.com', name: 'fakecustomer', image: null }
  ],
  totalCount: 1,
  reasons: [ 'Successfully fetched the users' ]
}
