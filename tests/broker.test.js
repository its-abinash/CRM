var producer = require("../Api/Broker/rmq.producer");
var consumer = require("../Api/Broker/rmq.consumer");
var amqp = require("amqplib/callback_api");
var logger = require("../Api/Logger/log")
var { socket } = require("../Configs/settings")

var sinon = require("sinon");
var assert = sinon.assert;

var fakeConnectionObject = {
  createChannel: function (callback) {
    callback(null, {
      assertExchange: function () {},
      assertQueue: function({}, {}, callback) {
        callback(null, {queue: "fake_queue"});
      },
      bindQueue: function() {},
      consume: function({}, callback, {}) {
        callback({
          fields: {
            routingKey: "test_routing_key"
          }
        });
      },
      publish: function () {},
    });
  },
  close: function () {},
};

var fakeConnectionObject2 = {
  createChannel: function (callback) {
    callback("some_err", {
      assertExchange: function () {},
      assertQueue: function({}, {}, callback) {
        callback("some_err", {queue: "fake_queue"});
      },
      bindQueue: function() {},
      consume: function({}, callback, {}) {
        callback({
          fields: {
            routingKey: "test_routing_key"
          }
        });
      },
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

var consumerTest = function () {
  it("consumer connection - success test", async function () {
    sinon.stub(amqp, "connect").callsArgWith(1, null, fakeConnectionObject);
    sinon.stub(socket, "emit")
    consumer.consume();
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var consumerFailureTests = function() {
  it("consumer connection - failure test", async function () {
    sinon.stub(amqp, "connect").callsArgWith(1, "some_err", fakeConnectionObject);
    sinon.stub(socket, "emit")
    sinon.stub(logger, 'info')
    try {
      consumer.consume();
    } catch (err) {
      assert.match(err, "some_err");
    }
  });
  it("consumer create channel - failure test", async function () {
    sinon.stub(amqp, "connect").callsArgWith(1, null, fakeConnectionObject2);
    sinon.stub(logger, 'info')
    sinon.stub(socket, "emit")
    try {
      consumer.consume();
    } catch (err) {
      assert.match(err, "some_err");
    }
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
}

describe("test_producer", producerTest);
describe("test_consumer", consumerTest);
describe("test_consumer_failure", consumerFailureTests);
