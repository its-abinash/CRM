var sinon = require("sinon");
var assert = sinon.assert;

var { validator } = require("../Controller/schema");
var main_utils = require("../Controller/main_utils");

var test_format = function () {
  it("is valid format returned", function () {
    var msg = "hello {0}";
    var formatList = ["world"];
    var res = main_utils.format(msg, formatList);
    assert.match(res, "hello world");
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var test_validatePayloadNegative = function () {
  it("is payload validated", async function () {
    sinon.stub(validator, "validate").throws({ type: "error" });
    try {
      var res = await main_utils.validatePayload({}, {});
    } catch (ex) {
      assert.match(ex.type, "error");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var test_validatePayloadPositiveCase = function () {
  it("is non-empty payload validated", async function () {
    sinon.stub(validator, "validate").returns({ valid: true });
    var res = await main_utils.validatePayload({}, {});
    assert.match(JSON.stringify(res), JSON.stringify([true, null]));
  });
  it("is empty payload validated", async function () {
    var res = await main_utils.validatePayload(null, {});
    assert.match(res, [false, []]);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var test_processPayload = function () {
  it("is payload processed", async function () {
    var res = await main_utils.processPayload({ fake_key: "fake_value" });
    assert.match(res, { fake_key: "fake_value" });
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var test_getMemoryUsage = function () {
  it("is having memory usage", function () {
    var exp = 10;
    var spy = sinon.spy(main_utils, "getMemoryUsage");
    main_utils.getMemoryUsage();
    assert.calledOnce(spy);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var test_cloneObject = function () {
  it("is cloned", function () {
    var data = { key: "value" };
    var res = main_utils.cloneObject(data);
    assert.match(res, data);
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_format", test_format);
describe("test_validatePayloadPositiveCase", test_validatePayloadPositiveCase);
describe("test_validatePayloadNegative", test_validatePayloadNegative);
describe("test_processPayload", test_processPayload);
describe("test_getMemoryUsage", test_getMemoryUsage);
describe("test_cloneObject", test_cloneObject);
