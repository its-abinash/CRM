const rmqConsumer = require("../Broker/rmq.consumer");
// const rmqPublisher = require("../Broker/rmq.producer");
const logger = require("../Logger/log");

module.exports.run_init_job = async function () {
  try {
    logger.info("Setting up RabbitMQ Server");
    // Publisher is not required for now
    // rmqPublisher.publish();
    rmqConsumer.consume();
    logger.info("RabbitMQ Server is Up & Running...");
  } catch (ex) {
    logger.error(`Error while connecting to RabbitMQ Server: ${ex}`);
  }
};
