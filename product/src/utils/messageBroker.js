const amqp = require("amqplib");

class MessageBroker {
  constructor() {
    this.channel = null;
  }

  async connect() {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const user = process.env.RABBITMQ_USER;
        const pass = process.env.RABBITMQ_PASS;
        const host = "rabbitmq";
        const port = 5672;
        const connection = await amqp.connect(
          `amqp://${user}:${pass}@${host}:${port}`
        );
        this.channel = await connection.createChannel(); // tao kenh
        await this.channel.assertQueue("products"); // tao queue products
        console.log("RabbitMQ connected");
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 20000); // delay 20 seconds to wait for RabbitMQ to start
  }

  async publishMessage(queue, message) {
    // gui tin nhan den queue
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        // gui tin nhan den
        queue,
        Buffer.from(JSON.stringify(message)) // chuyen doi message thanh buffer
      );
    } catch (err) {
      console.log(err);
    }
  }

  async consumeMessage(queue, callback) {
    // lang nghe tin nhan tu queue
    if (!this.channel) {
      console.error("No RabbitMQ channel available."); // khong co kenh RabbitMQ
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        // lang nghe tin nhan tu queue
        const content = message.content.toString(); // chuyen doi buffer thanh string
        const parsedContent = JSON.parse(content); // parse string thanh json
        callback(parsedContent); // goi callback voi noi dung tin nhan
        this.channel.ack(message); // xac nhan da nhan tin nhan
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageBroker();
