const producer = require("../Api/Broker/rmq.producer")
const consumer = require("../Api/Broker/rmq.consumer")
const amqp = require("amqplib")

var sinon = require("sinon");

var producerTest = function () {
  it("producer connection - success test", function () {
    producer.rmqPublisher("fake_msg");
  });
};

var consumerTest = function () {
  it("consumer connection - success test", function () {
    sinon.stub(amqp, 'connect');
    consumer.consume();
  });
};


describe("test_producer", producerTest);
describe("test_consumer", consumerTest);
