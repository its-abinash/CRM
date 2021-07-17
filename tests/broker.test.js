const producer = require("../Api/Broker/rmq.producer")
const consumer = require("../Api/Broker/rmq.consumer")
const amqp = require("amqplib")

var sinon = require("sinon");

var producerTest = function () {
  it("producer connection - success test", function () {
    producer.rmqPublisher("fake_msg");
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};

var consumerTest = function () {
  it("consumer connection - success test", function () {
    sinon.stub(amqp, 'connect');
    consumer.consume();
  });
  afterEach(function () {
    sinon.verifyAndRestore();
  });
};


describe("test_producer", producerTest);
describe("test_consumer", consumerTest);
