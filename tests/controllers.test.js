const authController = require("../Api/Controller/auth");
const coreServicesController = require("../Api/Controller/coreServices");
const userServicesController = require("../Api/Controller/userServices");
const dbUtils = require("../Database/databaseOperations");
const chatDao = require("../Api/Controller/chatDao");
const coreServiceDao = require("../Api/Controller/coreServiceDao");
const dashDao = require("../Api/Controller/dashDao");
const deleteServiceDao = require("../Api/Controller/deleteServiceDao");
const editServiceDao = require("../Api/Controller/editServiceDao");
const emailServiceDao = require("../Api/Controller/emailServiceDao");
const insertServiceDao = require("../Api/Controller/insertServiceDao");
const utils = require("../Api/Controller/utils");
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
  emailExceptionResponse,
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
  fakeAxiosGetData,
  fakeGetQuotesResponse,
  fakeAxiosGetDefaultData,
  fakeGetQuotesResponseForDefaultCategory,
  fakeAxiosGetEmptyData,
  fakeGetQuoteRequest1,
  fakeGetQuoteRequest2,
  fakeGetProfilePicResponse,
  fakeGetProfilePicResponse2,
  insertProfilePictureFailureRes,
  fakeLoginUserResponse,
  fakeLoginUserExpResponse,
  loginPayloadValidationErrorResponse,
  loginUserValidationErrorResponse,
  loginExceptionResponse,
  registerSuccessResponse,
  registerPayloadValidationErrorResponse,
  registrationFailureResponse,
  registerExceptionResponse,
  JWTAuthSuccessResponse,
  JWTAuthFailureResponse,
  JWTUserAuthErrorResponse,
  fakePatchRequest,
  fakeChatResponse3,
  GetNotificationRequest,
  getNotificationsResponse,
  encodedChatPayload,
} = require("../Configs/mockData");

var chatControllerTestPositive = function () {
  var testCases = [
    {
      testCaseName: "GET /chat - sender test",
      req: fakeGETChatRequest,
      res: fakeResponse,
      exp: fakeChatResponse,
      jwt: "loginuser_fake_email_id",
    },
    {
      testCaseName: "GET /chat - failure test",
      req: fakeGETChatRequest2,
      res: fakeResponse,
      exp: fakeChatResponse3,
      jwt: null,
    },
  ];
  for (const testCase of testCases) {
    it(testCase.testCaseName, async function () {
      sinon.stub(chatDao, "getConversation").returns(fakeChatData);
      sinon.stub(loggerUtils, "info");
      sinon.stub(loggerUtils, 'error');
      sinon.stub(utils, "decodeJwt").returns(testCase.jwt);
      await userServicesController.getConversation(testCase.req, testCase.res);
      assert.match(testCase.res.statusCode, testCase.exp.statusCode);
    });
  }
  it("POST /chat - DB Insertion Successful Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(chatDao, "saveConversation").returns(true);
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await userServicesController.chat(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeChatPOSTResponse);
  });
  it("POST /chat - user authorization failure Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.chat(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  it("GET /notifications - Success Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("user@gmail.com");
    const redisClient = redisMock.createClient({
      host: "test_host",
      port: "test_port",
      password: "test",
    });
    sinon.stub(redisClient, 'get').returns(false);
    await userServicesController.getNotification(
      GetNotificationRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, getNotificationsResponse.statusCode);
  });
  afterEach(function () {
    sinon.restore();
  });
};

var chatControllerTestNegative = function () {
  it("GET /chat - DB Exception Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(chatDao, "getConversation").throwsException("");
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
      sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
  it("GET /dashboard/getAdmins - get all admins test", async function () {
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(loggerUtils, "info");
    sinon.stub(dashDao, "getAllAdmins").returns([]);
    await userServicesController.getAdmins(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /dashboard/getAdmins - get all admins failure test", async function () {
    sinon.stub(utils, "decodeJwt").returns(null);
    sinon.stub(loggerUtils, "info");
    sinon.stub(dashDao, "getAllAdmins").returns([]);
    await userServicesController.getAdmins(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  it("GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(dashDao, "getAllCustomer").returns([]);
    await userServicesController.getCustomers(
      fakeChatPOSTRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /dashboard/getCustomer - Get all customers failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns(null);
    sinon.stub(dashDao, "getAllCustomer").returns([]);
    await userServicesController.getCustomers(
      fakeChatPOSTRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 401);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var dashboardControllerTestNegative = function () {
  it("GET /dashboard/getAdmins - get all admins test", async function () {
    sinon.stub(dashDao, "getAllAdmins").throwsException();
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await userServicesController.getAdmins(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(dashDao, "getAllCustomer").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(loggerUtils, "error");
    await userServicesController.getCustomers(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var deleteControllerTestPositive = function () {
  it("POST /delete - deletion of user success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(deleteServiceDao, "removeUserData").returns([false, false]);
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 400);
  });
  it("POST /delete - deletion of user exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(deleteServiceDao, "removeUserData").throwsException();
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("POST /delete - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    sinon.stub(deleteServiceDao, "removeUserData").returns([false, false]);
    await userServicesController.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(editServiceDao, "saveEditedData").returns(true);
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("PUT /edit - update user data failure test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(editServiceDao, "saveEditedData").returns(false);
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 400);
  });
  it("PUT /edit - Exception test", async function () {
    sinon.stub(validator, "validate").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("PUT /edit payload error test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(validator, "validate").returns({ valid: false });
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 422);
  });
  it("PUT /edit - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  // PATCH Methods
  it("PATCH /edit - patch user data test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
  });
  it("PATCH /edit payload error test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(validator, "validate").returns({ valid: false });
    await userServicesController.updateUserProperty(
      fakePatchRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 422);
  });
  it("PATCH /edit - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.updateUserProperty(
      fakeEditRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 401);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var emailControllerTest = function () {
  it("POST /email - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
  it("POST /email - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  it("POST /email - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(emailServiceDao, "getPassCode").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        throw "CONNERR";
      },
    });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, emailExceptionResponse);
  });
  it("POST /email - DB Exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(emailServiceDao, "getPassCode").throwsException();
    sinon.stub(validator, "validate").returns({ valid: true });
    await userServicesController.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var constantsControllerTest = function () {
  it("GET /constants - success test", async function () {
    sinon.stub(loggerUtils, "info");
    await coreServicesController.getAllConstants(
      loginPayloadRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, fakeConstants);
  });
  it("GET /constants/constId/fieldId - success test", async function () {
    sinon.stub(loggerUtils, "info");
    await coreServicesController.getSpecificFromConstants(
      getSpecificFromConstantsRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, getSpecificFromConstantsResponse);
  });
  it("GET /constants/constId/fieldId - fieldId exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var fakeReq = JSON.parse(JSON.stringify(getSpecificFromConstantsRequest));
    fakeReq["params"]["fieldId"] = "fake_field";
    await coreServicesController.getSpecificFromConstants(
      fakeReq,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
    assert.match(
      fakeResponse.response.reasons[0],
      "Requested field is not found"
    );
  });
  it("GET /constants/constId/fieldId - field exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var fakeReq = JSON.parse(JSON.stringify(getSpecificFromConstantsRequest));
    fakeReq["params"]["constId"] = "fake_constId";
    await coreServicesController.getSpecificFromConstants(
      fakeReq,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
    assert.match(
      fakeResponse.response.reasons[0],
      "Requested constantId not found"
    );
  });
  it("GET /constants/constId - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var fakeReq = JSON.parse(JSON.stringify(getSpecificFromConstantsRequest));
    await coreServicesController.getConstant(fakeReq, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /constants/constId - constId exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var fakeReq = JSON.parse(JSON.stringify(getSpecificFromConstantsRequest));
    fakeReq["params"]["constId"] = "fake_constId";
    await coreServicesController.getConstant(fakeReq, fakeResponse);
    assert.match(
      fakeResponse.response.reasons[0],
      "Requested constantId not found"
    );
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getLatestRemaindersControllerTest = function () {
  it("GET /getLatestRemainderInformation - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
  it("GET /verifyJWT - user unauthorized test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").returns(null);
    var fakeReq = {
      path: "/fakepath",
      method: "fakemethod",
    };
    await coreServicesController.verifyJWT(fakeReq, fakeResponse);
    assert.match(fakeResponse.response, JWTUserAuthErrorResponse);
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await coreServicesController.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeUserTypeResponse);
  });
  it("GET /getUserType - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(coreServiceDao, "getUserTypeFromDB").throwsException();
    await coreServicesController.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /getLoginUser - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await coreServicesController.getLoginUser(
      fakeChatPOSTRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, fakeLoginUserResponse);
  });
  it("GET /getLoginUser - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    await coreServicesController.getLoginUser(fakeRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeLoginUserExpResponse);
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertSuccessfulResponse);
  });
  it("POST /insert - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(validator, "validate").returns({ valid: false });
    var insertPayloadErrorResponse = emailWrongPayloadResponse;
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertPayloadErrorResponse);
  });
  it("POST /insert - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(insertServiceDao, "insertUserData").throwsException();
    sinon.stub(deleteServiceDao, "removeDataOnFailure");
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(axios, "get").returns({ data: "" });
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("POST /insert - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  it("POST /insertProfilePicture begins - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(insertServiceDao, "saveImageIntoDB");
    await userServicesController.insertProfilePicture(
      fakeInsertPayloadRequest2,
      fakeResponse
    );
    assert.match(fakeResponse.response, insertSuccessfulResponse1);
  });
  it("POST /insertProfilePicture begins - user authorization failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    await userServicesController.insertProfilePicture(
      fakeInsertPayloadRequest2,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 401);
  });
  it("POST /insertProfilePicture begins - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "saveImageIntoDB").throwsException();
    await userServicesController.insertProfilePicture(
      fakeGetQuoteRequest2,
      fakeResponse
    );
    assert.match(fakeResponse.response, insertProfilePictureFailureRes);
  });
  it("POST /insertProfilePicture begins - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(insertServiceDao, "saveImageIntoDB").throwsException();
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
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
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

var getQuotesTest = function () {
  it("GET /getQuotes - fetch category from url success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(Math, "random").returns(0);
    sinon.stub(axios, "get").returns(fakeAxiosGetData);
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    await coreServicesController.getQuotes(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeGetQuotesResponse);
  });
  it("GET /getQuotes - get default category success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(axios, "get").returns(fakeAxiosGetDefaultData);
    await coreServicesController.getQuotes(loginPayloadRequest, fakeResponse);
    assert.match(
      fakeResponse.response,
      fakeGetQuotesResponseForDefaultCategory
    );
  });
  it("GET /getQuotes - get default category success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    sinon.stub(axios, "get").returns(fakeAxiosGetDefaultData);
    await coreServicesController.getQuotes(loginPayloadRequest, fakeResponse);
    assert.match(
      fakeResponse.response,
      fakeGetQuotesResponseForDefaultCategory
    );
  });
  it("GET /getQuotes - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
    var stubFunc = sinon.stub(axios, "get");
    stubFunc.onCall(0).returns(fakeAxiosGetData);
    stubFunc.onCall(1).returns(fakeAxiosGetEmptyData);
    await coreServicesController.getQuotes(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /getQuotes - user unauthorized test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(utils, "decodeJwt").returns(null);
    await coreServicesController.getQuotes(loginPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 401);
  });
  it("GET /getProfilePicture - all tests", async function () {});
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getProfilePicture = async function () {
  var testCases = [
    {
      name: "GET /getProfilePicture - valid values from db - success tests",
      fetchValue: [
        {
          img_data: "fake_url",
          name: "fake_name",
        },
      ],
      exp: fakeGetProfilePicResponse,
      req: fakeGetQuoteRequest1,
    },
    {
      name: "GET /getProfilePicture - no values found from db - success tests",
      fetchValue: [
        {
          img_data: null,
          name: null,
        },
      ],
      exp: fakeGetProfilePicResponse2,
      req: fakeGetQuoteRequest1,
    },
  ];
  for (const testCase of testCases) {
    it(testCase.name, async function () {
      sinon.stub(loggerUtils, "info");
      sinon.stub(utils, "decodeJwt").returns("sender@gmail.com");
      sinon.stub(axios, "get").returns({});
      sinon.stub(Buffer, "from").returns("fakeImgUrl");
      sinon.stub(dbUtils, "fetch").returns(testCase.fetchValue);
      await coreServicesController.getProfilePicture(
        testCase.req,
        fakeResponse
      );
      assert.match(fakeResponse.response, testCase.exp);
    });
    afterEach(function () {
      sinon.verifyAndRestore();
    });
  }
};

describe("test_chat_positive", chatControllerTestPositive);
describe("test_chat_negative", chatControllerTestNegative);
describe("test_dashboard_positive", dashboardControllerTestPositive);
describe("test_dashboard_negative", dashboardControllerTestNegative);
describe("test_delete_positive", deleteControllerTestPositive);
describe("test_delete_negative", deleteControllerTestNegative);
describe("test_edit", editControllerTest);
describe("test_email", emailControllerTest);
describe("test_constants", constantsControllerTest);
describe("test_getLatestRemainders", getLatestRemaindersControllerTest);
describe("test_getUserType", getUserTypeUtilsControllerTest);
describe("test_insert", insertControllerTest);
describe("test_login", loginControllerTest);
describe("test_logout", logoutControllerTest);
describe("test_register", registerControllerTest);
describe("test_getQuotes", getQuotesTest);
describe("test_getProfilePicture", getProfilePicture);
