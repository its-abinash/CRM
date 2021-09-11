var amqp = require("amqplib");

class RMQ {
  constructor(connectionURI) {
    this.URI = connectionURI;
  }
  async getInstance() {
    var connection = await amqp.connect(this.URI);
    return connection;
  }
}

const RMQ_INSTANCE = new RMQ(process.env.RMQ_URL);

module.exports = RMQ_INSTANCE;