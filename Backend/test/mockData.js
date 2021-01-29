module.exports.fakeServer = "http://localhost:3000";

module.exports.fakeChatPOSTRequest = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    user: "sender@gmail.com",
  },
  body: {
    receiver: "receiver@gmail.com",
    chatmsg: "fake_msg",
  },
};

module.exports.fakeRequest = {
  path: "/fake_path",
  method: "fake_method",
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
};

// status(200).send

module.exports.fakeGETChatRequest = {
  session: {
    user: "fake_user@gmail.com",
  },
  params: {
    receiverId: "fake_receiver@gmail.com",
  },
  path: "/fake_path",
  method: "fake_method",
};

module.exports.fakeGETChatRequest2 = {
  session: {
    user: "sender@gmail.com",
  },
  params: {
    receiverId: "receiver@gmail.com",
  },
  path: "/fake_path",
  method: "fake_method",
};

module.exports.fakeChatData = [
  {
    sender: "sender@gmail.com",
    receiver: "receiver@gmail.com",
    msg: "U2FsdGVkX1/0568a5bCQKN4RqauV23i4IdFIMsCwIAA=",
    timestamp: "2021-01-24T10:09:50.762Z",
  },
];

module.exports.fakeChatResponse = {
  responseId: "RI_001",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      sender: "sender@gmail.com",
      receiver: "receiver@gmail.com",
      msg: "ello",
      timestamp: "3:39:50 PM",
      time_loc: "time-left",
      color: "darker",
    },
  ],
  totalCount: 1,
  reasons: [
    "Conversations between userId: fake_user@gmail.com and userId: fake_receiver@gmail.com are successfully retrieved",
  ],
};

module.exports.fakeChatResponse2 = {
  responseId: "RI_001",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      sender: "sender@gmail.com",
      receiver: "receiver@gmail.com",
      msg: "",
      timestamp: "Invalid Date",
      time_loc: "time-right",
      color: "",
    },
  ],
  totalCount: 1,
  reasons: [
    "Conversations between userId: sender@gmail.com and userId: receiver@gmail.com are successfully retrieved",
  ],
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
  reasons: [[]],
};

module.exports.fakeChatExceptionResponse = {
  responseId: "a5rva1-szja3m-sd6vya",
  status: "BAD_GATEWAY",
  statusCode: 502,
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
  body: {
    email: "user@gmail.com",
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
    property: "instance",
    message: 'requires property "remfreq"',
    instance: {
      name: "Somit",
      email: "sumit@gmail.com",
      phone: "1111111111111111",
    },
    name: "required",
    argument: "remfreq",
    stack: 'instance requires property "remfreq"',
  },
  {
    path: [],
    property: "instance",
    message: 'requires property "gst"',
    instance: {
      name: "Somit",
      email: "sumit@gmail.com",
      phone: "111111111111111111",
    },
    name: "required",
    argument: "gst",
    stack: 'instance requires property "gst"',
  },
];

module.exports.fakeBuildErrorReasons = [
  {
    field: "instance",
    error: "Invalid value passed to 'instance' field",
  },
  {
    field: "instance",
    error: "Invalid value passed to 'instance' field",
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
