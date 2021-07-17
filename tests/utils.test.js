var sinon = require("sinon");
var assert = sinon.assert;

var { validator } = require("../Api/Controller/schema");
var main_utils = require("../Api/Controller/main_utils");
var loggerUtils = require("../Api/Logger/log");
var responseUtils = require("../Api/Controller/response_utils");
var utils = require("../Api/Controller/utils");
const {
  fakeBuildResponse1,
  fakeBuildResponse2,
  fakeBuildResponse3,
  fakeBuildResponse4,
  fakeBuildErrorReasonsPayload,
  fakeBuildErrorReasons,
} = require("../Configs/mockData");
var jwt = require("jsonwebtoken");

var mainUtilsControllerTest = function () {
  it("String format check test", function () {
    var msg = "hello {0}";
    var formatList = ["world"];
    var res = main_utils.format(msg, formatList);
    assert.match(res, "hello world");
  });
  it("Non-empty payload validation test", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    sinon.stub(loggerUtils, "info");
    var res = await main_utils.validatePayload({}, {});
    assert.match(JSON.stringify(res), JSON.stringify([true, null]));
  });
  it("Empty payload validation test", async function () {
    sinon.stub(loggerUtils, "info");
    var res = await main_utils.validatePayload(null, {});
    assert.match(res, [false, []]);
  });
  it("Payload validation test", async function () {
    sinon.stub(validator, "validate").throws({ type: "error" });
    try {
      var res = await main_utils.validatePayload({}, {});
    } catch (ex) {
      assert.match(ex.type, "error");
    }
  });
  it("Payload processing test", async function () {
    var res = await main_utils.processPayload({ fake_key: "fake_value" });
    assert.match(res, { fake_key: "fake_value" });
  });
  it("MemoryUsage test", function () {
    var spy = sinon.spy(main_utils, "getMemoryUsage");
    sinon.stub(loggerUtils, "info");
    main_utils.getMemoryUsage();
    assert.calledOnce(spy);
  });
  it("Clone Object Test", function () {
    var data = { key: "value" };
    var res = main_utils.cloneObject(data);
    assert.match(res, data);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var responseUtilsControllerTest = function () {
  var AppRes = new responseUtils.AppResponse({
    session: {
      destroy: function () {},
    },
  });
  var testCases = [
    {
      tc_name: "buildResponse test-1",
      data: "fake_data",
      reasons: "fake_reasons",
      statusCode: 200,
      responseId: "fake_responseId",
      exp: fakeBuildResponse1,
    },
    {
      tc_name: "buildResponse test-2",
      data: null,
      reasons: null,
      statusCode: 200,
      responseId: "fake_responseId",
      exp: fakeBuildResponse2,
    },
    {
      tc_name: "buildResponse test-3",
      data: ["fake_data"],
      reasons: null,
      statusCode: 200,
      responseId: "fake_responseId",
      exp: fakeBuildResponse3,
    },
    {
      tc_name: "buildResponse test-4",
      data: { key: "fake_data" },
      reasons: null,
      statusCode: 200,
      responseId: "fake_responseId",
      exp: fakeBuildResponse4,
    },
  ];
  for (const testCase of testCases) {
    it(testCase.tc_name, async function () {
      sinon.stub(loggerUtils, "info");
      var result = await AppRes.buildResponse(
        testCase.data,
        testCase.reasons,
        testCase.statusCode,
        testCase.responseId
      );
      assert.match(result, testCase.exp);
    });
  }
  it("buildErrorReasons test", async function () {
    sinon.stub(loggerUtils, "info");
    var result = await AppRes.buildErrorReasons(fakeBuildErrorReasonsPayload);
    assert.match(result, fakeBuildErrorReasons);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var testUtils = function () {
  var AppRes = new responseUtils.AppResponse({
    headers: {
      "x-access-token": "XXXXXXX.XXXXXXX.XXXXXXX",
    },
  });
  it("decodeJwt - success test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").returns({ id: "fake_id@gmail.com" });
    var loggedInUserId = await utils.decodeJwt(AppRes);
    assert.match(loggedInUserId, "fake_id@gmail.com");
  });
  it("decodeJwt - exception test", async function () {
    sinon.stub(loggerUtils, "info");
    sinon.stub(jwt, "verify").throwsException(Error('fake_exp'));
    try {
      await utils.decodeJwt(AppRes);
    } catch (ex) {
      assert.match(ex.message, "fake_exp");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_main_utils", mainUtilsControllerTest);
describe("test_response_utils", responseUtilsControllerTest);
describe("test_utils", testUtils);
