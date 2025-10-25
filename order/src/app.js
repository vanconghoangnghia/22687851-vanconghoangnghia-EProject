const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
  }

  async connectDB() {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  }

  async disconnectDB() {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }

  async setupOrderConsumer() {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const user = process.env.RABBITMQ_USER;
        const pass = process.env.RABBITMQ_PASS;
        const host = "rabbitmq";
        const port = 5672;
        const amqpServer = `amqp://${user}:${pass}@${host}:${port}`;
        const connection = await amqp.connect(amqpServer);
        console.log("Connected to RabbitMQ");
        const channel = await connection.createChannel(); // tạo kênh giao tiếp với RabbitMQ
        await channel.assertQueue("orders"); // khai báo hàng đợi order nếu chưa tồn tại

        channel.consume("orders", async (data) => {
          // theo dõi hàng đợi order
          // Consume messages from the order queue on buy
          console.log("Consuming ORDER service");
          const { products, username, orderId } = JSON.parse(data.content); // lấy dữ liệu từ message

          const newOrder = new Order({
            // tạo đơn hàng mới
            products,
            user: username,
            totalPrice: products.reduce(
              (acc, product) => acc + product.price,
              0
            ), // tính tổng giá tiền
          });

          // Save order to DB
          await newOrder.save(); // lưu đơn hàng vào database

          // Send ACK to ORDER service
          channel.ack(data); // gửi xác nhận đã nhận và xử lý message
          console.log("Order saved to DB and ACK sent to ORDER queue");

          // Send fulfilled order to PRODUCTS service
          // Include orderId in the message
          const {
            user,
            products: savedProducts,
            totalPrice,
          } = newOrder.toJSON(); // lấy dữ liệu đơn hàng đã lưu
          channel.sendToQueue(
            // gửi đơn hàng đã hoàn thành đến hàng đợi products
            "products",
            Buffer.from(
              JSON.stringify({
                orderId,
                user,
                products: savedProducts,
                totalPrice,
              })
            ) // gửi kèm orderId
          );
        });
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 30000); // add a delay to wait for RabbitMQ to start in docker-compose
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      // eslint-disable-line no-unused-vars
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
