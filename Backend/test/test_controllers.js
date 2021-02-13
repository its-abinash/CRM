var chatUtils = require("../Controller/chat");
var dashboardUtils = require("../Controller/dashboard");
var deleteUtils = require("../Controller/delete");
var editUtils = require("../Controller/edit");
var emailUtils = require("../Controller/email");
var getConstantsUtils = require("../Controller/getConstants");
var getLatestRemaindersUtils = require("../Controller/latestRemainderInformation");
var getUserTypeUtils = require("../Controller/getUserType");
var insertUtils = require("../Controller/insert");
var landingPageUtils = require("../Controller/landingPage");
var loginUtils = require("../Controller/loginController");
var registerUtils = require("../Controller/registerController");
var dbUtils = require("../../Database/databaseOperations");
var loggerUtils = require("../Logger/log");
var { validator } = require("../Controller/schema");
var jp = require("jsonpath");
var mailer = require("nodemailer");

var sinon = require("sinon");
var assert = sinon.assert;

const {
  fakeGETChatRequest,
  fakeGETChatRequest2,
  fakeResponse,
  fakeChatResponse,
  fakeChatData,
  fakeChatResponse2,
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
} = require("./mockData");

var chatControllerTestPositive = function () {
  var testCases = [
    {
      testCaseName: "GET /chat - sender test",
      req: fakeGETChatRequest,
      res: fakeResponse,
      exp: fakeChatResponse,
    },
    {
      testCaseName: "GET /chat - receiver test",
      req: fakeGETChatRequest2,
      res: fakeResponse,
      exp: fakeChatResponse2,
    },
  ];
  for (const testCase of testCases) {
    it(testCase.testCaseName, async function () {
      sinon.stub(dbUtils, "fetch").returns(fakeChatData);
      sinon.stub(loggerUtils, "info");
      await chatUtils.getConversation(testCase.req, testCase.res);
      assert.match(testCase.res.statusCode, testCase.exp.statusCode);
    });
  }
  it("POST /chat - DB Insertion Successful Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").returns(true);
    await chatUtils.chat(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeChatPOSTResponse);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var chatControllerTestNegative = function () {
  it("GET /chat - DB Exception Test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "fetch").throwsException("");
    await chatUtils.getConversation(fakeGETChatRequest, fakeResponse);
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
        await chatUtils.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response, testCase.exp);
      } else if (testCase.isError) {
        sinon.stub(dbUtils, "insert").returns(false);
        await chatUtils.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response, testCase.exp);
      } else if (testCase.isException) {
        sinon.stub(dbUtils, "insert").throwsException("");
        await chatUtils.chat(fakeChatPOSTRequest, fakeResponse);
        assert.match(fakeResponse.response.statusCode, testCase.exp);
      }
    });
  }
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var dashboardControllerTestPositive = function () {
  it("GET /dashboard - Render dashboard test", async function () {
    sinon.stub(loggerUtils, "info");
    var response = {
      render: sinon.spy(),
    };
    await dashboardUtils.getDashboardPage(fakeRequest, response);
    assert.calledOnce(response.render);
  });
  it("GET /dashboard/getAdmins - get all admins test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetchAllUsersForGivenUserId").returns([]);
    await dashboardUtils.getAdmins(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetchAllUsersForGivenUserId").returns([]);
    await dashboardUtils.getCustomers(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var dashboardControllerTestNegative = function () {
  it("GET /dashboard/getAdmins - get all admins test", async function () {
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await dashboardUtils.getAdmins(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(dbUtils, "fetchAllUsersForGivenUserId").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await dashboardUtils.getCustomers(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var deleteControllerTestPositive = function () {
  it("POST /delete - deletion of user success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "remove").returns(true);
    await deleteUtils.delete(fakeDeleteUserRequest, fakeResponse);
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
    sinon.stub(dbUtils, "remove").returns(false);
    await deleteUtils.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 400);
  });
  it("POST /delete - deletion of user exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "remove").throwsException();
    await deleteUtils.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var editControllerTest = function () {
  it("POST /edit - update user data test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "update").returns(true);
    await editUtils.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("POST /edit - update user data failure test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "update").returns(false);
    await editUtils.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 400);
  });
  it("POST /edit - Exception test", async function () {
    sinon.stub(validator, "validate").throwsException();
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    await editUtils.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  it("POST /edit payload error test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    await editUtils.edit(fakeEditRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 422);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var emailControllerTest = function () {
  it("POST /email - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetch").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        return;
      },
    });
    await emailUtils.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeEmailResponse);
  });
  it("POST /email - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "fetch").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: false });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        return;
      },
    });
    await emailUtils.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, emailWrongPayloadResponse);
  });
  it("POST /email - Request Exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "fetch").returns(specificCredData);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(mailer, "createTransport").returns({
      sendMail: function () {
        throw "CONNERR";
      },
    });
    await emailUtils.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.response, emailExceptionResponse);
  });
  it("POST /email - DB Exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "fetch").throwsException();
    sinon.stub(validator, "validate").returns({ valid: true });
    await emailUtils.email(fakeEmailRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var constantsControllerTest = function () {
  it("GET /constants - success test", async function () {
    sinon.stub(loggerUtils, "info");
    await getConstantsUtils.getAllConstants(fakeRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeConstants);
  });
  it("GET /constants/constId/fieldId - success test", async function () {
    sinon.stub(loggerUtils, "info");
    await getConstantsUtils.getSpecificFromConstants(
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
    await getConstantsUtils.getSpecificFromConstants(fakeReq, fakeResponse);
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
    await getConstantsUtils.getSpecificFromConstants(fakeReq, fakeResponse);
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
    await getConstantsUtils.getConstant(fakeReq, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET /constants/constId - constId exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    var fakeReq = JSON.parse(JSON.stringify(getSpecificFromConstantsRequest));
    fakeReq["params"]["constId"] = "fake_constId";
    await getConstantsUtils.getConstant(fakeReq, fakeResponse);
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
    sinon.stub(dbUtils, "update").returns(true);
    sinon
      .stub(dbUtils, "fetchLatestRemainder")
      .returns(fakeLatestRemainderData);
    await getLatestRemaindersUtils.latestRemainderInformation(
      fakeRequest,
      fakeResponse
    );
    assert.match(fakeResponse.response, fakeRemainderResponse);
  });
  it("GET /getLatestRemainderInformation - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "update").returns(true);
    sinon.stub(dbUtils, "fetchLatestRemainder").throwsException();
    await getLatestRemaindersUtils.latestRemainderInformation(
      fakeRequest,
      fakeResponse
    );
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var getUserTypeUtilsControllerTest = function () {
  it("GET /getUserType - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetch").returns(specificCredData);
    await getUserTypeUtils.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.response, fakeUserTypeResponse);
  });
  it("GET /getUserType - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "fetch").throwsException();
    await getUserTypeUtils.getUserType(fakeChatPOSTRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var insertControllerTest = function () {
  it("POST /insert - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").returns(true);
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await insertUtils.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertSuccessfulResponse);
  });
  it("POST /insert - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    var insertPayloadErrorResponse = emailWrongPayloadResponse;
    await insertUtils.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertPayloadErrorResponse);
  });
  it("POST /insert - failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").returns(false);
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await insertUtils.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.response, insertFailureResponse);
  });
  it("POST /insert - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").throwsException();
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    await insertUtils.insert(fakeInsertPayloadRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var landingPageControllerTest = function () {
  it("GET /landingPage - success test", async function () {
    sinon.stub(loggerUtils, "info");
    var response = {
      render: sinon.spy(),
    };
    await landingPageUtils.landingPage(fakeRequest, response);
    assert.calledOnce(response.render);
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
    var response = {
      redirect: sinon.spy(),
    };
    await loginUtils.login(loginPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /login - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    var response = {
      redirect: sinon.spy(),
    };
    await loginUtils.login(loginPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /login - user validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").returns(false);
    sinon.stub(validator, "validate").returns({ valid: true });
    var response = {
      redirect: sinon.spy(),
    };
    await loginUtils.login(loginPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /login - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").throwsException();
    sinon.stub(validator, "validate").returns({ valid: true });
    var response = {
      redirect: sinon.spy(),
    };
    await loginUtils.login(loginPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("GET /login", async function () {
    sinon.stub(loggerUtils, "info");
    var response = {
      render: sinon.spy(),
    };
    await loginUtils.getLoginPage(fakeRequest, response);
    assert.calledOnce(response.render);
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
    var response = {
      redirect: sinon.spy(),
    };
    await registerUtils.register(registerPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /register - payload validation failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(validator, "validate").returns({ valid: false });
    var response = {
      redirect: sinon.spy(),
    };
    await registerUtils.register(registerPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /register - registration failure test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").returns(false);
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(dbUtils, "insert").returns(false);
    var response = {
      redirect: sinon.spy(),
    };
    await registerUtils.register(registerPayloadRequest, response);
    assert.calledOnce(response.redirect);
  });
  it("POST /register - DB exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "isExistingUser").throwsException();
    sinon.stub(validator, "validate").returns({ valid: true });
    var dateObj = new Date();
    sinon.stub(dateObj, "setDate");
    sinon.stub(dateObj, "toLocaleDateString").returns("01/01/2021");
    var response = {
      redirect: sinon.spy(),
    };
    await registerUtils.register(registerPayloadRequest, response);
    assert.calledOnce(response.redirect);
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
describe("test_constants", constantsControllerTest);
describe("test_getLatestRemainders", getLatestRemaindersControllerTest);
describe("test_getUserType", getUserTypeUtilsControllerTest);
describe("test_insert", insertControllerTest);
describe("test_landingPage", landingPageControllerTest);
describe("test_login", loginControllerTest);
describe("test_register", registerControllerTest);
