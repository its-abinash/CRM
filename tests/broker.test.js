var producer = require("../Api/Broker/rmq.producer");
var amqp = require("amqplib/callback_api");

var sinon = require("sinon");
var assert = sinon.assert;

var fakeConnectionObject = {
  createChannel: function (callback) {
    callback(null, {
      assertExchange: function () {},
      publish: function () {},
    });
  },
  close: function () {},
};

var fakeConnectionObject2 = {
  createChannel: function (callback) {
    callback("some_err", {
      assertExchange: function () {},
      publish: function () {},
    });
  },
  close: function () {},
};

var producerTest = function () {
  it("producer connection - success test", async function () {
    sinon.stub(amqp, "connect").callsArgWith(1, null, fakeConnectionObject);

    producer.rmqPublisher("fake_msg");
  });
  it("producer connection - failure test", async function () {
    sinon
      .stub(amqp, "connect")
      .callsArgWith(1, "some_err", fakeConnectionObject);
    try {
      producer.rmqPublisher("fake_msg");
    } catch (err) {
      assert.match(err, "some_err");
    }
  });
  it("producer create channel - failure test", async function () {
    sinon.stub(amqp, "connect").callsArgWith(1, null, fakeConnectionObject2);
    try {
      producer.rmqPublisher("fake_msg");
    } catch (err) {
      assert.match(err, "some_err");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

describe("test_producer", producerTest);
