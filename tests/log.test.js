var sinon = require("sinon");
var logUtils = require("../Api/Logger/log");
var assert = sinon.assert;

describe("test_log_utils", function () {
  it("log test", function () {
    var spy1 = sinon.spy(logUtils, 'timeZoned')
    logUtils.timeZoned()
    assert.calledOnce(spy1)
    var spy = sinon.spy(logUtils, "currentTime");
    logUtils.currentTime()
    assert.calledOnce(spy);
  });
});
