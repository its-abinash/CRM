const authController = require("../Api/Controller/auth");
const coreServicesController = require("../Api/Controller/coreServices");
const userServicesController = require("../Api/Controller/userServices");
const dbUtils = require("../Database/databaseOperations");
const chatDao = require("../Api/Controller/chatDao");
const coreServiceDao = require("../Api/Controller/coreServiceDao");
const dashDao = require("../Api/Controller/dashDao");
const chatService = require("../Api/Controller/chatService")
const deleteServiceDao = require("../Api/Controller/deleteServiceDao");
const editServiceDao = require("../Api/Controller/editServiceDao");
const emailServiceDao = require("../Api/Controller/emailServiceDao");
const insertServiceDao = require("../Api/Controller/insertServiceDao");
const jwt = require("jsonwebtoken");
const redisMock = require("redis-mock");

var loggerUtils = require("../Api/Logger/log");
var { validator } = require("../Api/Controller/schema");
var jp = require("jsonpath");
var mailer = require("nodemailer");
const axios = require("axios").default;

var sinon = require("sinon");
var assert = sinon.assert;
const {
  fakeGETChatRequest,
  fakeGETChatRequest2,
  fakeResponse,
  fakeChatResponse,
  fakeChatData,
  fakeResponseWithException,
  fakeChatPOSTRequest,
  fakeChatPOSTResponse,
  fakeChatPayloadErrorResponse,
  fakeChatExceptionResponse,
  fakeChatErrorResponse,
  fakeRequest,
  fakeDeleteUserRequest,
  fakeEditRequest,
  specificCredData,
  fakeEmailRequest,
  fakeEmailResponse,
  emailWrongPayloadResponse,
  fakeConstants,
  getSpecificFromConstantsRequest,
  getSpecificFromConstantsResponse,
  fakeLatestRemainderData,
  fakeRemainderResponse,
  fakeUserTypeResponse,
  fakeInsertPayloadRequest,
  insertSuccessfulResponse,
  insertFailureResponse,
  loginPayloadRequest,
  registerPayloadRequest,
  fakeInsertPayloadRequest2,
  insertSuccessfulResponse1,
  fakeGetQuoteRequest1,
  fakeGetQuoteRequest2,
  fakeGetProfilePicResponse,
  fakeGetProfilePicResponse2,
  insertProfilePictureFailureRes,
  fakeLoginUserResponse,
  loginPayloadValidationErrorResponse,
  loginUserValidationErrorResponse,
  loginExceptionResponse,
  registerSuccessResponse,
  registerPayloadValidationErrorResponse,
  registrationFailureResponse,
  registerExceptionResponse,
  JWTAuthSuccessResponse,
  JWTAuthFailureResponse,
  fakePatchRequest,
  GetNotificationRequest,
  getNotificationsResponse,
  userInfoResponse,
  deleteUserDataResp,
  fakeChatData1,
  fakeAdminData,
  fakeCustmerData,
  allUsers,
  fakeGetAllUsersResp1,
} = require("../Configs/mockData");

var chatControllerTestPositive = function () {
  var testCases = [
    {
      testCaseName: "GET /chat - sender test",
      req: fakeGETChatRequest2,
      res: fakeResponse,
      exp: fakeChatResponse,
    }
  ];
  for (const testCase of testCases) {
    it(testCase.testCaseName, async function () {
      sinon.stub(chatDao, "getConversationWithImage").returns([fakeChatData,fakeChatData1]);
      sinon.stub(loggerUtils, "info");
      sinon.stub(loggerUtils, 'error');
      await userServicesController.getConversation(testCase.req, testCase.res);
      assert.match(testCase.res.statusCode, testCase.exp.statusCode);
    });
  }
  it("POST /chat - DB Insertion Successful Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(chatDao, "saveConversation").returns(true);
    var req = fakeChatPOSTRequest
    req["loggedInUser"] = "sender@gmail.com"
    await userServicesController.chat(req, fakeResponse);
    assert.match(fakeResponse.response, fakeChatPOSTResponse);
  });
  it("GET /notifications - Success Test", async function () {
    sinon.stub(loggerUtils, "info");
    const redisClient = redisMock.createClient({
      host: "test_host",
      port: "test_port",
      password: "test",
    });
    var req = GetNotificationRequest
    req["loggedInUser"] = "user@gmail.com"
    sinon.stub(redisClient, 'get').returns(false);
    await userServicesController.getNotification(
      req,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, getNotificationsResponse.statusCode);
  });
  it("GET /notifications - Exception Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var req = GetNotificationRequest
    req["loggedInUser"] = "user@gmail.com"
    sinon.stub(chatService, "checkAndGetNotifications").throwsException("CONNERR");
    await userServicesController.getNotification(
      req,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502)
  });
  afterEach(function () {
    sinon.restore();
  });
};

var chatControllerTestNegative = function () {
  it("GET /chat - DB Exception Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(chatDao, "getConversationWithImage").throwsException("");
    await userServicesController.getConversation(
      fakeGETChatRequest,
      fakeResponse
    );
    assert.match(
      fakeResponse.response.statusCode,
      fakeResponseWithException.statusCode
    );
  });
  var testCases = [
    {
      name: "POST /chat - ValidationError Test",
      validationValue: { valid: false },
      exp: fakeChatPayloadErrorResponse,
      isException: false,
      isError: false,
    },
    {
      name: "POST /chat - DB Exception Test",
      validationValue: { valid: true },
      exp: fakeChatExceptionResponse.statusCode,
      isException: true,
      isError: false,
    },
    {
      name: "POST /chat - DB Insertion Error Test",
      validationValue: { valid: true },
      exp: fakeChatErrorResponse,
      isException: false,
      isError: true,
    },
  ];
  for (const testCase of testCases) {
    it(testCase.name, async function () {
      sinon.stub(loggerUtils, "info");
      sinon.stub(loggerUtils, "error");
      sinon.stub(validator, "validate").returns(testCase.validationValue);
      sinon.stub(jp, "query").returns([]);
      if (!testCase.isError && !testCase.isException) {
        await userServicesController.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response, testCase.exp);
      } else if (testCase.isError) {
        sinon.stub(chatDao, "saveConversation").returns(false);
        await userServicesController.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response, testCase.exp);
      } else if (testCase.isException) {
        sinon.stub(chatDao, "saveConversation").throwsException("");
        await userServicesController.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response.statusCode, testCase.exp);
      }
    });
  }
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var dashboardControllerTestPositive = function () {
  it("GET /dashboard/users - get all users test1", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dashDao, "getAllAdmins").returns([]);
    sinon.stub(dashDao, "getAllCustomer").returns([]);
    sinon.stub(dashDao, 'getAllUsers').returns([]);
    await userServicesController.getUsers(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /dashboard/users - get all users test2", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dashDao, "getAllAdmins").returns([fakeAdminData]);
    sinon.stub(dashDao, "getAllCustomer").returns([fakeCustmerData]);
    sinon.stub(dashDao, 'getAllUsers').returns(allUsers);
    sinon.stub(dashDao, "getImage").returns(null);
    var req = fakeChatPOSTRequest;
    req["originalUrl"] = "?U2FsdGVkX1/WU9y8OOk0IdvYRo499qdQbSEETz0/y5RToDPgHRX3ofLaEcMagN9I"
    await userServicesController.getUsers(req, fakeResponse);
    assert.match(fakeResponse.response, fakeGetAllUsersResp1);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var dashboardControllerTestNegative = function () {
  it("GET /dashboard/users - get all admins test", async function () {
    sinon.stub(dashDao, "getAllAdmins").throwsException();
    sinon.stub(dashDao, "getAllCustomer").throwsException();
    sinon.stub(dashDao, 'getAllUsers').throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await userServicesController.getUsers(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 500);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var deleteControllerTestPositive = function () {
  it("POST /delete - deletion of user success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(deleteServiceDao, "removeUserData").returns([true, true]);
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var deleteControllerTestNegative = function () {
  it("POST /delete - deletion of user failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(deleteServiceDao, "removeUserData").returns([false, false]);
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("POST /delete - deletion of user exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(deleteServiceDao, "removeUserData").throwsException();
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var editControllerTest = function () {
  // PUT methods
  it("PUT /edit - update user data test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(editServiceDao, "updateCredential").returns(true);
    sinon.stub(editServiceDao, "updateProfilePicture").returns(true);
    sinon.stub(editServiceDao, "saveEditedData").returns(true);
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("PUT /edit - update user data failure test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(editServiceDao, "updateCredential").returns(false);
    sinon.stub(editServiceDao, "updateProfilePicture").returns(false);
    sinon.stub(editServiceDao, "saveEditedData").returns(false);
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 400);
  });
  it("PUT /edit - Exception test", async function () {
    sinon.stub(validator, "validate").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("PUT /edit payload error test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 422);
  });
  // PATCH Methods
  it("PATCH /edit - patch user data test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(editServiceDao, "saveEditedData").returns(true);
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 200);
  });
  it("PATCH /edit - patch user data failure test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(editServiceDao, "saveEditedData").returns(false);
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 400);
  });
  it("PATCH /edit - Exception test", async function () {
    sinon.stub(validator, "validate").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
  });
  it("PATCH /edit payload error test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 422);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var emailControllerTest = function () {
  it("POST /email - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(emailServiceDao, "getPassCode").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        return;
      },
    });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeEmailResponse);
  });
  it("POST /email - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(emailServiceDao, "getPassCode").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: false });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        return;
      },
    });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, emailWrongPayloadResponse);
  });
  it("POST /email - Request Exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(emailServiceDao, "getPassCode").throwsException("CONNERR");
    sinon.stub(validator, "validate").returns({ valid: true });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("POST /email - DB Exception test", async function () {
    sinon.stub(loggerUtils, "info");
    // sinon.stub(loggerUtils, "error");
    sinon.stub(emailServiceDao, "getPassCode").throwsException("DBEXCP");
    sinon.stub(validator, "validate").returns({ valid: true });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getLatestRemaindersControllerTest = function () {
  it("GET /getLatestRemainderInformation - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(coreServiceDao, "updateRemainderDateInDB").returns(true);
    sinon
      .stub(coreServiceDao, "getCustomerForRemainderFromDB")
      .returns(fakeLatestRemainderData);
    await coreServicesController.latestRemainderInformation(
      loginPayloadRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, fakeRemainderResponse);
  });
  it("GET /getLatestRemainderInformation - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(coreServiceDao, "updateRemainderDateInDB").returns(true);
    sinon
      .stub(coreServiceDao, "getCustomerForRemainderFromDB")
      .throwsException();
    await coreServicesController.latestRemainderInformation(
      fakeRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /verifyJWT - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").returns("fake_token");
    await coreServicesController.verifyJWT(fakeRequest, fakeResponse);
    assert.match(fakeResponse.response, JWTAuthSuccessResponse);
  });
  it("GET /verifyJWT - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").returns(null);
    await coreServicesController.verifyJWT(fakeRequest, fakeResponse);
    assert.match(fakeResponse.response, JWTAuthFailureResponse);
  });
  it("GET /verifyJWT - exception test", async function () {
    sinon.stub(loggerUtils, "error");
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").throwsException(Error("fake_exp"));
    await coreServicesController.verifyJWT(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getUserTypeUtilsControllerTest = function () {
  it("GET /getUserType - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(coreServiceDao, "getUserTypeFromDB").returns(true);
    await coreServicesController.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeUserTypeResponse);
  });
  it("GET /getUserType - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(coreServiceDao, "getUserTypeFromDB").throwsException();
    await coreServicesController.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /getLoginUser - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await coreServicesController.getLoginUser(
      fakeChatPOSTRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, fakeLoginUserResponse);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var insertControllerTest = function () {
  it("POST /insert - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "insertUserData").returns(true);
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(axios, "get").returns({ data: "" });
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertSuccessfulResponse);
  });
  it("POST /insert - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    var insertPayloadErrorResponse = emailWrongPayloadResponse;
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertPayloadErrorResponse);
  });
  it("POST /insert - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "insertUserData").returns(false);
    sinon.stub(deleteServiceDao, "removeDataOnFailure");
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(axios, "get").returns({ data: "" });
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertFailureResponse);
  });
  it("POST /insert - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "insertUserData").throwsException();
    sinon.stub(deleteServiceDao, "removeDataOnFailure");
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(axios, "get").returns({ data: "" });
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    var req = fakeInsertPayloadRequest
    req["loggedInUser"] = "sender@gmail.com";
    await userServicesController.insert(req, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("POST /insertProfilePicture begins - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "saveImageIntoDB");
    var req = fakeInsertPayloadRequest2
    req["loggedInUser"] = "sender@gmail.com";
    await userServicesController.insertProfilePicture(
      req,
      fakeResponse
    );
    assert.match(fakeResponse.response, insertSuccessfulResponse1);
  });
  it("POST /insertProfilePicture begins - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "saveImageIntoDB").throwsException();
    var req = fakeGetQuoteRequest2
    req["loggedInUser"] = "sender@gmail.com";
    await userServicesController.insertProfilePicture(
      req,
      fakeResponse
    );
    assert.match(fakeResponse.response, insertProfilePictureFailureRes);
  });
  it("POST /insertProfilePicture begins - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "saveImageIntoDB").throwsException();
    var req = fakeInsertPayloadRequest2
    req["loggedInUser"] = "sender@gmail.com";
    await userServicesController.insertProfilePicture(
      fakeInsertPayloadRequest2,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var loginControllerTest = function () {
  it("POST /login - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "isExistingUser").returns(true);
    sinon.stub(dbUtils, "isValidUser").returns(true);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(jwt, "sign").returns("XXXXXX.XXXXXXX.XXXXXX");
    await authController.login(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("POST /login - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    await authController.login(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, loginPayloadValidationErrorResponse);
  });
  it("POST /login - user validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").returns(false);
    sinon.stub(validator, "validate").returns({ valid: true });
    await authController.login(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, loginUserValidationErrorResponse);
  });
  it("POST /login - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").throwsException(Error("fake_exp"));
    sinon.stub(validator, "validate").returns({ valid: true });
    await authController.login(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, loginExceptionResponse);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var logoutControllerTest = function () {
  it("GET /logout test", async function () {
    sinon.stub(loggerUtils, "info");
    var req = {
      path: "/fake_path",
      method: "fake_method",
      headers: {
        "x-access-token": "XXXXXXXXXXX.XXXXXXXXXXXX.XXXXXXXXXXXXX",
      },
      session: {
        destroy: function () {},
      },
    };
    authController.logout(req, fakeResponse);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var registerControllerTest = function () {
  it("POST /register - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "isExistingUser").returns(false);
    sinon.stub(validator, "validate").returns({ valid: true });
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    sinon.stub(dbUtils, "insert").returns(true);
    sinon.stub(dbUtils, "insertMedia").returns(true);
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").returns([
      {
        email: "user1@gmail.com",
        name: "user1",
      },
      {
        email: "user2@gmail.com",
        name: "user2",
      },
    ]);
    await authController.register(registerPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, registerSuccessResponse);
  });
  it("POST /register - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    await authController.register(registerPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, registerPayloadValidationErrorResponse);
  });
  it("POST /register - registration failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").returns(false);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").returns(false);
    sinon.stub(dbUtils, "insertMedia").returns(false);
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").returns([]);
    sinon.stub(dbUtils, "remove").returns(true);
    await authController.register(registerPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, registrationFailureResponse);
  });
  it("POST /register - existing user failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").returns(true);
    sinon.stub(validator, "validate").returns({ valid: true });
    await authController.register(registerPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 409);
  });
  it("POST /register - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").throwsException(Error("fake_exp"));
    sinon.stub(dbUtils, "remove").returns(true);
    sinon.stub(validator, "validate").returns({ valid: true });
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await authController.register(registerPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, registerExceptionResponse);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getUserInfo = async function () {
  var testCases = [
    {
      name: "GET /user/{userId} - valid values from db - success tests",
      isExp: false,
      fetchValue: [{
        "image": "img_data",
        "size": "1024",
        "lastmodified": "12345",
        "type": "img/jpeg",
        "imagename": "2021-01-05.jpeg",
        "email": "abinashbiswal248@gmail.com",
        "name": "Abinash Biswal",
        "firstname": "Abinash",
        "lastname": "Biswal",
        "phone": "1234567890"
      }],
      exp: userInfoResponse,
      req: loginPayloadRequest,
    },
    {
      name: "GET /user/{userId} - exception tests",
      isExp: true,
      fetchValue: "CONNERR",
      exp: userInfoResponse,
      req: loginPayloadRequest,
    }
  ];
  for (const testCase of testCases) {
    it(testCase.name, async function () {
      sinon.stub(loggerUtils, "info");
      sinon.stub(loggerUtils, 'error');
      if (testCase.isExp) {
        sinon.stub(dashDao, "getUserData").throwsException(testCase.fetchValue);
      }else {
        sinon.stub(dashDao, "getUserData").returns(testCase.fetchValue);
      }
      await userServicesController.getUserInfo(
        testCase.req,
        fakeResponse
      );
      if (testCase.isExp) {
        assert.match(fakeResponse.statusCode, 502);
      }else {
        assert.match(fakeResponse.response, testCase.exp);
      }
    });
    afterEach(function () {
      sinon.verifyAndRestore();
    });
  }
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var deleteUserInfo = async function () {
  it("DELETE /user/{userId}/{deleteProperties} - Success Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, 'error');
    sinon.stub(dbUtils, "updateSpecificUserData").returns(true);
    var req = loginPayloadRequest
    req["loggedInUser"] = "sender@gmail.com";
    await userServicesController.deleteUserData(
      req,
      fakeResponse
    );
    assert.match(fakeResponse.response, deleteUserDataResp);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_chat_positive", chatControllerTestPositive);
describe("test_chat_negative", chatControllerTestNegative);
describe("test_dashboard_positive", dashboardControllerTestPositive);
describe("test_dashboard_negative", dashboardControllerTestNegative);
describe("test_delete_positive", deleteControllerTestPositive);
describe("test_delete_negative", deleteControllerTestNegative);
describe("test_edit", editControllerTest);
describe("test_email", emailControllerTest);
describe("test_getLatestRemainders", getLatestRemaindersControllerTest);
describe("test_getUserType", getUserTypeUtilsControllerTest);
describe("test_insert", insertControllerTest);
describe("test_login", loginControllerTest);
describe("test_logout", logoutControllerTest);
describe("test_register", registerControllerTest);
describe("test_getUserInfo", getUserInfo);
describe("test_deleteUser", deleteUserInfo);
