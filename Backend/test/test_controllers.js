var chatUtils = require("../Controller/chat");
var dashboardUtils = require("../Controller/dashboard");
var deleteUtils = require("../Controller/delete");
// -- TODO --
// var editUtils = require("../Controller/edit");
// var emailUtils = require("../Controller/email");
// var getConstantsUtils = require("../Controller/getConstants");
// var getLatestRemaindersUtils = require("../Controller/latestRemainderInformation");
// var getUserTypeUtils = require("../Controller/getUserType");
// var insertUtils = require("../Controller/insert");
// var landingPageUtils = require("../Controller/landingPage");
// var loginUtils = require("../Controller/loginController");
// var registerUtils = require("../Controller/registerController");
var dbUtils = require("../../Database/databaseOperations");
var loggerUtils = require("../Logger/log");
var { validator } = require("../Controller/schema");
var jp = require("jsonpath");

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
    sinon.stub(fakeResponse, "render");
    sinon.stub(loggerUtils, "info");
    await dashboardUtils.getDashboardPage(fakeRequest, fakeResponse);
  });
  it("GET /dashboard/getAdmins - get all admins test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").returns([]);
    await dashboardUtils.getAdmins(fakeRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 200);
  });
  it("GET GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").returns([]);
    await dashboardUtils.getCustomers(fakeRequest, fakeResponse);
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
  it("GET GET /dashboard/getCustomer - Get all customers test", async function () {
    sinon.stub(dbUtils, "fetchAllUserOfGivenType").throwsException();
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
  it("POST /delete - deletion of user exception test", async function() {
    sinon.stub(loggerUtils, "info");
    sinon.stub(loggerUtils, "error");
    sinon.stub(dbUtils, "remove").throwsException()
    await deleteUtils.delete(fakeDeleteUserRequest, fakeResponse);
    assert.match(fakeResponse.statusCode, 502);
  })
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
