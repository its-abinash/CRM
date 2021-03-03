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
  redirect: function () {},
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
  body: {
    email: "receiver@gmail.com",
    name: "receiver",
    phone: "12345",
    remfreq: "2",
  },
};

module.exports.fakeEmailRequest = {
  session: {
    user: "sender@gmail.com",
  },
  body: {
    email: "receiver@gmail.com",
    subject: "sub",
    body: "body",
  },
  path: "/fake_path",
  method: "fake_method",
};

module.exports.fakeEmailResponse = {
  responseId: "RI_013",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [],
  totalCount: 0,
  reasons: ["Successfully sent email to user with userId: receiver@gmail.com"],
};

module.exports.emailWrongPayloadResponse = {
  responseId: "RI_004",
  status: "UNPROCESSABLE_ENTITY",
  statusCode: 422,
  responseMessage:
    "The request was well-formed but was unable to be followed due to semantic errors.",
  values: [],
  totalCount: 0,
  reasons: [[]],
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
        REG: "register",
        LOGIN: "login",
        CONTACT: "contact",
        EDIT: "edit",
        ADD: "insert",
        UPLOAD: "insertProfilePicture",
        DELETE: "delete",
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
    'Successfully fetched the Constants with value = {"CYPHER":{"ENCRYPTIONKEY":"#","DECRYPTIONKEY":"#"},"ROUTES":{"REG":"register","LOGIN":"login","CONTACT":"contact","EDIT":"edit","ADD":"insert","UPLOAD":"insertProfilePicture","DELETE":"delete","EMAIL":"email","CHAT":"chat","DASHBOARD":{"CUSTOMER":"dashboard/getCustomer","ADMIN":"dashboard/getAdmins"}}}',
  ],
};

module.exports.getSpecificFromConstantsRequest = {
  params: {
    constId: "ROUTES",
    fieldId: "REG",
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
  reasons: ["Successfully fetched the Constant with value = register"],
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
    'Successfully fetched the remainder information with value = [{"email":"demo1@gmail.com","subject":"Check Latest Business Deals!","body":"Hello,\\n\\nA gentle remainder to check our latest business deals.\\n\\nPlease let us know about your thoughts.\\n\\nThanks,\\nAbinash Biswal"},{"email":"demo2@gmail.com","subject":"Check Latest Business Deals!","body":"Hello,\\n\\nA gentle remainder to check our latest business deals.\\n\\nPlease let us know about your thoughts.\\n\\nThanks,\\nAbinash Biswal"}]',
  ],
};

module.exports.fakeUserTypeResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [true],
  totalCount: 1,
  reasons: ["Successfully fetched the is_admin flag with value = true"],
};

module.exports.fakeInsertPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    user: "sender@gmail.com",
  },
  body: {
    name: "c1_name1",
    email: "c1@gmail.com",
    phone: "1234568484",
    gst: "jdbdhbdhd",
    remfreq: 2,
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
    "Successfully inserted Profile Picture of user having userId: sender@gmail.com",
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
  reasons: ["Successfully inserted data of user having userId: c1@gmail.com"],
};

module.exports.insertFailureResponse = {
  responseId: "RI_012",
  status: "BAD_REQUEST",
  statusCode: 400,
  responseMessage:
    "The server cannot or will not process the request due to an apparent client error.",
  values: [],
  totalCount: 0,
  reasons: ["Failed to insert data of user having userId: c1@gmail.com"],
};

module.exports.loginPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  session: {
    user: "sender@gmail.com",
    password: "pass",
  },
  body: {
    email: "c1@gmail.com",
    password: "pass",
  },
};

module.exports.registerPayloadRequest = {
  path: "/fake_path",
  method: "fake_method",
  body: {
    email: "c1@gmail.com",
    password: "pass",
    username: "usename",
    phonenum: "111111",
    gstnum: "suhdud",
    remfreq: "2",
    passcode: "jdudhdu",
  },
};

module.exports.fakeAxiosGetData = {
  data: {
    contents: {
      categories: {
        inspire: "Inspiring Quote of the day",
        management: "Management Quote of the day",
        sports: "Sports Quote of the day",
        life: "Quote of the day about life",
        funny: "Funny Quote of the day",
        love: "Quote of the day about Love",
        art: "Art quote of the day ",
        students: "Quote of the day for students",
      },
      quotes: [
        {
          quote: "fake quote",
          author: "fake author",
          title: "fake title",
          background: "fake background",
          permalink: "fake permalink",
        },
      ],
    },
    userId: 1,
    id: 1,
    title: "fake_title",
    body: "fake_body",
  },
};

module.exports.fakeAxiosGetDefaultData = {
  data: {
    contents: {
      categories: {},
      quotes: [
        {
          quote: "fake quote",
          author: "fake author",
          title: "fake title",
          background: "fake background",
          permalink: "fake permalink",
        },
      ],
    },
    userId: 1,
    id: 1,
    title: "fake_title",
    body: "fake_body",
  },
};

module.exports.fakeAxiosGetEmptyData = {
  data: {},
};

module.exports.fakeGetQuotesResponse = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      quote: "fake quote",
      author: "fake author",
      title: "fake title",
      imgUrl: "fake background",
      credit: "fake permalink",
    },
  ],
  totalCount: 1,
  reasons: [
    'Successfully fetched the quote with value = {"quote":"fake quote","author":"fake author","title":"fake title","imgUrl":"fake background","credit":"fake permalink"}',
  ],
};

module.exports.fakeGetQuotesResponseForDefaultCategory = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [
    {
      quote:
        "Don't try to fix the students, fix ourselves first. The good teacher makes the poor student good and the good student superior. When our students fail, we, as teachers, too, have failed.",
      author: "Marva Collins",
      title: "Quote of the day for students",
      imgUrl: "https://theysaidso.com/img/qod/qod-students.jpg",
      credit:
        "https://theysaidso.com/quote/marva-collins-dont-try-to-fix-the-students-fix-ourselves-first-the-good-teacher",
    },
  ],
  totalCount: 1,
  reasons: [
    `Successfully fetched the quote with value = {"quote":"Don't try to fix the students, fix ourselves first. The good teacher makes the poor student good and the good student superior. When our students fail, we, as teachers, too, have failed.","author":"Marva Collins","title":"Quote of the day for students","imgUrl":"https://theysaidso.com/img/qod/qod-students.jpg","credit":"https://theysaidso.com/quote/marva-collins-dont-try-to-fix-the-students-fix-ourselves-first-the-good-teacher"}`,
  ],
};

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
  reasons: ["Successfully fetched the Img Data with value = fake_url"],
};

module.exports.fakeGetProfilePicResponse2 = {
  responseId: "RI_006",
  status: "OK",
  statusCode: 200,
  responseMessage: "Standard response for successful HTTP requests.",
  values: [{ name: null, url: "data:image/png;base64, fakeImgUrl" }],
  totalCount: 1,
  reasons: [
    "Successfully fetched the Img Data with value = data:image/png;base64, fakeImgUrl",
  ],
};
