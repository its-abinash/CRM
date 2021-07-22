var { socket } = require("../Configs/settings");
var proxyrequire = require("proxyquire").noCallThru();

var sinon = require("sinon");

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
        consume: function () {},
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
    var rmqUtils = proxyrequire("../Api/Broker/rmq.consumer", {
      amqplib: rmqStub,
    });
    sinon.stub(socket, "emit");
    await rmqUtils.consume();
    await rmqUtils.consumeUtil({ content: "someData" });
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_producer", producerTest);
describe("test_consumer", consumerTest);
