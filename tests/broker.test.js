var { socket } = require("../Configs/settings");
var proxyrequire = require("proxyquire").noCallThru();
var { RMQ_INSTANCE } = require("../Api/Broker/rmqConnection");
var emailServices = require("../Api/Controller/emailService");
var { consumer } = require("../Api/Broker/rmq.consumer")
var sinon = require("sinon");
const { assert } = require("sinon");

function getFakeRMQStub() {
  var fakeConnectionObject = {
    connect: function () {
      return this;
    },

    createChannel: function () {
      return {
        assertExchange: function () {},
        publish: function () {},
        assertQueue: function () {
          return { queue: "test" };
        },
        bindQueue: function () {},
        consume: function (queuename = "fake_queue", callback) {
          callback({
            content: JSON.stringify({ transportFields: {}, payload: {} }),
          });
        },
      };
    },
    close: function () {},
  };
  return fakeConnectionObject;
}

var producerTest = function () {
  it("producer connection - success test", async function () {
    var rmqStub = getFakeRMQStub();
    var rmqUtils = proxyrequire("../Api/Broker/rmq.producer", {
      amqplib: rmqStub,
    });
    rmqUtils.rmqPublisher("fake_msg");
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var consumerTest = function () {
  it("consumer connection - success test", async function () {
    var rmqStub = getFakeRMQStub();
    sinon.stub(RMQ_INSTANCE, "getInstance").returns(rmqStub);
    var rmqUtils = proxyrequire("../Api/Broker/consumerUtils", {
      amqplib: rmqStub,
    });
    var firstSpy = sinon.stub(emailServices, "sendEmailUtil");
    assert.notCalled(firstSpy);
    sinon.stub(socket, "emit");
    await rmqUtils.consumeUtil();
  });
  it("consumer without callback - success test", async function () {
    var rmqStub = {
      consume: async function (queuename = "fake_queue", callback) {
        callback({
          content: JSON.stringify({ key: "value" }),
        });
      },
    };
    sinon.stub(socket, "emit");
    await consumer({}, rmqStub, null)
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_producer", producerTest);
describe("test_consumer", consumerTest);
